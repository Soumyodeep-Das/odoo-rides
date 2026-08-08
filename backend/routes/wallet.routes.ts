import { Router } from "express";
import {
  createRechargeOrder,
  verifyRechargeAndCreditWallet,
  getWallet,
} from "../controllers/wallet.controller.ts";

const router = Router();

// Wallet info
router.get("/:userId", getWallet);

// Razorpay wallet recharge — two-step flow
router.post("/recharge/create-order", createRechargeOrder);
router.post("/recharge/verify", verifyRechargeAndCreditWallet);

export default router;
