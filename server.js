import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 3500;

await connectDB();
// allowed multiple origins
const allowedOrigins = ["http://localhost:5173"];

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.get("/", (req, res) => {
    res.send("G-Mart server is running...!!");
});
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});