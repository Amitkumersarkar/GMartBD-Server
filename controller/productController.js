import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files || [];

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const newProduct = await Product.create({ ...productData, image: imagesUrl });

        res.json({ success: true, product: newProduct, message: "Product Added" });
    } catch (error) {
        console.log("Add Product Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get Product List : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log("Product List Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.query; // fixed: get id from query
        if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        res.json({ success: true, product });
    } catch (error) {
        console.log("Product By ID Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

        await Product.findByIdAndUpdate(id, { inStock });
        res.json({ success: true, message: "Stock Updated" });
    } catch (error) {
        console.log("Change Stock Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};