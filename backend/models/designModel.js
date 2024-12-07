import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
	{
		imageUrl: { type: String, required: true },
		position: { x: { type: Number }, y: { type: Number } },
		size: { width: { type: Number }, height: { type: Number } },
	},
	{ timestamps: true }
);

const Design = mongoose.model("Design", designSchema);
export default Design;
