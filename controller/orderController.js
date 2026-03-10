import Order from "../models/order.js";
import Product from "../models/product.js";
import Address from "../models/address.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//  Place Order COD: POST /api/order/cod
export const placeOrderCod = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid Data" });
        }

        // Calculate total amount
        let amount = 0;
        for (const item of items) {
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
            isPaid: true,
        });

        return res.json({ success: true, message: "Order Placed Successfully", order: newOrder });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//   Place Order Stripe: POST /api/order/stripe

export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid Data" });
        }

        let lineItems = [];
        let amount = 0;

        // Calculate total and prepare Stripe line items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) continue;

            amount += product.offerPrice * (item.quantity || 1);

            lineItems.push({
                price_data: {
                    currency: process.env.VITE_CURRENCY || "usd",
                    product_data: { name: product.name },
                    unit_amount: product.offerPrice * 100,
                },
                quantity: item.quantity || 1,
            });
        }

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/myOrders?success=true`,
            cancel_url: `${origin}/cart?canceled=true`,
        });

        // Save order in DB (not paid yet)
        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Stripe",
            isPaid: false,
        });

        return res.json({
            success: true,
            message: "Stripe Order Created",
            order: newOrder,
            checkoutUrl: session.url,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  Get Orders by User: GET /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


//  Get All Orders (Seller/Admin): GET /api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};