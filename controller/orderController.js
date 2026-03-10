import Order from "../models/order.js";
import Product from "../models/product.js";
import Address from "../models/address.js";

// Place Order COD : /api/order/cod
export const placeOrderCod = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // Calculate total amount
        let amount = 0;
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) continue;
            amount += product.offerPrice * (item.quantity || 1);
        }

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully", order: newOrder });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get Orders by user ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get All Orders for seller/admin : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};