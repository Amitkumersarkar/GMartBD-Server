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

        const normalizedEmail = email.toLowerCase();

        // check if user already exists with this email
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser)
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        // hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user in database
        const user = await User.create({
            name,
            email: normalizedEmail,
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
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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
}


// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user)
            return res.status(401).json({
                success: false,
                message: "Invalid Email or password"
            });

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.status(401).json({
                success: false,
                message: "Invalid Email or password"
            });


        // create JWT token with user id
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // send user data without password
        return res.status(200).json({
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
}

// check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {

        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Logout User : /api/user/logout

export const logout = async (req, res) => {
    try {

    } catch (error) {

    }
}

