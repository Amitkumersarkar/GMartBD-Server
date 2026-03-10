import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, // will set from logged-in user
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }, // string to preserve formatting
    country: { type: String, required: true },
    phone: { type: String, required: true }, // match frontend field "phone"
}, {
    timestamps: true
});

const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;