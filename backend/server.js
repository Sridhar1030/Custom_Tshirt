import express, { json } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js"; 
import cors from "cors";
import uploadRouter from "./routes/upload.routes.js"; 
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.router.js";
dotenv.config(); 

const app = express();
app.use(json());
app.use(cors());

connectDB();

app.use("/api", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v1/auth", userRouter);

app.get("/test", (req, res) => {
	res.json({ message: "Server is up and running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
