import express from "express";
import { addAddress, getAddress } from "../controller/addressController.js";
import authUser from "../middlewares/authUser.js";

const addressRouter = express.Router();

// Add Address (POST)
addressRouter.post("/add", authUser, addAddress);

// Get Address (GET)
addressRouter.get("/get", authUser, getAddress);

export default addressRouter;