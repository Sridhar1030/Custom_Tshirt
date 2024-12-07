import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from "./routes/upload.routes.js"; // Import the router for image upload

dotenv.config(); // Load environment variables

const app = express();
app.use(json());
app.use(cors());

// Use the uploadRouter for the /api/upload route
app.use("/api", uploadRouter);

// Test route to check server status
app.get("/test", (req, res) => {
	res.json({ message: "Server is up and running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
