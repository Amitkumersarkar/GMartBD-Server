import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, requires: true, ref: 'user' },
    items: [{
        product: { type: String, requires: true, ref: 'product' },
        quantity: { type: Number, requires: true, }
    }],
    amount: { type: Number, requires: true, },
    address: { type: String, requires: true, ref: 'address' },
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },

}, { timestamps: true })

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order;