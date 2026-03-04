import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;