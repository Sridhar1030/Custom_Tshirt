import Design from "../models/designModel.js";

// Create a new design
export const createDesign = async (req, res) => {
	try {
		const design = new Design(req.body);
		const savedDesign = await design.save();
		res.status(201).json(savedDesign);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get all designs
export const getDesigns = async (req, res) => {
	try {
		const designs = await Design.find();
		res.status(200).json(designs);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
