import express from "express";
import { sellerLogin, sellerLogout, isSellerAuth } from "../controller/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const router = express.Router();

// Routes
router.post("/login", sellerLogin);
router.get("/logout", authSeller, sellerLogout); // must be GET to match frontend
router.get("/is-auth", authSeller, isSellerAuth);

export default router;