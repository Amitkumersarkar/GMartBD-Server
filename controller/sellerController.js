// Login Seller : /api/seller/login
import jwt from "jsonwebtoken";

export const sellerLogin = (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate credentials
        if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Success response
        return res.status(200).json({
            success: true,
            message: "Seller logged in successfully"
        });

    } catch (error) {
        console.error("Seller login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};