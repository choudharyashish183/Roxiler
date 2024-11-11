// controllers/initializeController.js
const axios = require("axios");
const Product = require("../models/productModel");

const initializeDatabase = async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;

    // Clear the collection before initializing
    await Product.deleteMany();

    // Prepare data to be inserted
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      sold: product.sold,
      dateOfSale: new Date(product.dateOfSale),
    }));

    // Insert the data into the collection 
    await Product.insertMany(formattedProducts);

    res.status(201).json({ message: "Database initialized with seed data" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res
      .status(500)
      .json({ message: "Failed to initialize database", error: error.message });
  }
};

module.exports = { initializeDatabase };
