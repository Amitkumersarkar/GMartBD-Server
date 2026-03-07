import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order;