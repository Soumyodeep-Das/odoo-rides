import { type Request, type Response } from "express";
import crypto from "crypto";
import getRazorpay from "../lib/razorpay.ts";
import { prisma } from "../lib/prisma.ts";

/**
 * Step 1 — Create a Razorpay order for wallet recharge
 * POST /api/wallet/recharge/create-order
 * Body: { userId: string, amount: number }   (amount in INR, e.g. 500 = ₹500)
 */
export const createRechargeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ error: "userId and a positive amount are required" });
    }

    const amountInPaise = Math.round(Number(amount) * 100); // Razorpay expects paise

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      // Unique receipt — helps trace this order in Razorpay dashboard
      receipt: `wallet_${userId.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        purpose: "wallet_recharge",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amountInPaise,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open checkout
      },
    });
  } catch (error) {
    console.error("Error creating recharge order:", error);
    return res.status(500).json({ error: "Failed to create recharge order" });
  }
};

/**
 * Step 2 — Verify Razorpay signature & credit wallet
 * POST /api/wallet/recharge/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount }
 *
 * IMPORTANT: This is the only place that touches wallet balance.
 * The signature check prevents any spoofed credit requests.
 */
export const verifyRechargeAndCreditWallet = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount, // INR float (same value sent in step 1)
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !amount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Verify HMAC signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ error: "Razorpay secret not configured" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 2. Idempotency guard — reject duplicate payment IDs
    const alreadyProcessed = await prisma.walletTransaction.findFirst({
      where: { referenceId: razorpay_payment_id },
    });

    if (alreadyProcessed) {
      return res.status(409).json({
        error: "This payment has already been processed",
      });
    }

    // 3. Credit wallet atomically
    const creditAmount = Number(amount);

    const result = await prisma.$transaction(async (tx) => {
      // Upsert wallet (create if first time)
      const wallet = await tx.wallet.upsert({
        where: { userId },
        update: { balance: { increment: creditAmount } },
        create: { userId, balance: creditAmount },
      });

      // Record the transaction
      const txRecord = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "CREDIT",
          amount: creditAmount,
          description: `Wallet recharge via Razorpay`,
          referenceId: razorpay_payment_id, // used for idempotency check above
        },
      });

      return { wallet, txRecord };
    });

    return res.status(200).json({
      success: true,
      message: `₹${creditAmount} credited to wallet`,
      data: {
        balance: result.wallet.balance,
        transactionId: result.txRecord.id,
      },
    });
  } catch (error) {
    console.error("Error verifying recharge:", error);
    return res.status(500).json({ error: "Failed to process recharge" });
  }
};

/**
 * GET /api/wallet/:userId
 * Returns current wallet balance and recent transaction history
 */
export const getWallet = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!wallet) {
      // Wallet doesn't exist yet — return zero balance, not an error
      return res.status(200).json({
        success: true,
        data: { balance: 0, transactions: [] },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        transactions: wallet.transactions,
      },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ error: "Failed to fetch wallet" });
  }
};
