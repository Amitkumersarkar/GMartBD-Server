import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized"
        });
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if (!decoded.email) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

        // Attach seller info to request
        req.sellerEmail = decoded.email;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }
};

export default authSeller;