import express from "express";
import { upload } from "../config/multer.js";
import authSeller from "../middlewares/authSeller.js";

const productRouter = express.Router();
productRouter.post('/add', upload.array([images]), authSeller);
