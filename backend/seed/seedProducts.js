import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  { name: "Widget A", price: 9.99, desc: "Small widget" },
  { name: "Widget B", price: 19.5, desc: "Medium widget" },
  { name: "Gadget C", price: 5.0, desc: "Accessory" },
  { name: "Gizmo D", price: 29.99, desc: "Premium gizmo" },
  { name: "Thingamajig E", price: 12.0, desc: "Handy item" },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Products seeded!");
    mongoose.disconnect();
  })
  .catch((err) => console.error("❌ Seed error:", err));
