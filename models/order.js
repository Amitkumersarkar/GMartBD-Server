import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Address" },
        status: { type: String, default: "Order Placed" },
        paymentType: { type: String, required: true },
        isPaid: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
);

// Use existing model if already registered
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;