import { type Request, type Response } from "express";
import crypto from "crypto";
import razorpay from "../lib/razorpay.ts";

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", receipt = "receipt_1" } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({ error: "Razorpay secret not configured" });
    }

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: "Transaction not legit!" });
    }

    // Payment is verified
    // Here you can update your database (e.g., mark Payment status as SUCCESS)

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
