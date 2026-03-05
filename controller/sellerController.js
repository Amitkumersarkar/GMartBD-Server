// sellerController.js
import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login
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
            { email }, // payload
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

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

// Seller IsAuth : /api/seller/is-auth
export const isSellerAuth = (req, res) => {
    try {
        // At this point, authSeller middleware should have verified the token
        // and attached req.sellerEmail

        if (!req.sellerEmail) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized"
            });
        }

        return res.status(200).json({
            success: true,
            email: req.sellerEmail
        });

    } catch (error) {
        console.error("Seller isAuth error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Logout Seller: /api/seller/logout
export const sellerLogout = (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Seller logged out successfully"
        });

    } catch (error) {
        console.error("Seller logout error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};