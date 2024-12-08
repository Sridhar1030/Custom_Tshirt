import { Product } from "../models/product.models.js";
import { User } from "../models/user.model.js";

export const getAllProductsWithUserInfo = async (req, res) => {
	try {
		// Populating 'userId' field with 'name' and 'email' from User model
		const products = await Product.find().populate(
			"userId",  // This matches the field in your Product model
			"name email"
		);
		
		// If no products found
		if (!products || products.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		
		// Return the products with populated user info
		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching products with user info:", error);
		res.status(500).json({ message: "Server error" });
	}
};
