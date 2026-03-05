// Login Seller : /api/seller/login
import jwt from "jsonwebtoken";

export const sellerLogin = (req, res) => {
    const { email, password } = req.body;

    if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Seller logged in successfully" });
};