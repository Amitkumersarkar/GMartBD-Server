import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user : /api/user/register
export const register = async (req, res) => {
    try {
        // get user data from frontend
        const { name, email, password } = req.body;

        // check if any field is missing
        if (!name || !email || !password)
            return res.status(400).json({
                success: false,
                message: "Missing Details"
            });

        // check if user already exists with this email
        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        // hash password before saving and it's never store plain password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // create JWT token with user id
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // store token in cookie
        res.cookie("token", token, {
            // httpOnly = frontend JS cannot access it
            httpOnly: true,
            // secure = only works in production
            secure: process.env.NODE_ENV === "production",
            // sameSite = helps prevent CSRF
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            // expire within 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // send user data without password
        return res.status(201).json({
            success: true,
            user: {
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ success: false, 'Email and password are required'})
    } catch (error) {

    }
}