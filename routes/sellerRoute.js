import express from "express";
import { sellerLogin, sellerLogout, isSellerAuth } from "../controller/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.post("/logout", authSeller, sellerLogout);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);

export default sellerRouter;