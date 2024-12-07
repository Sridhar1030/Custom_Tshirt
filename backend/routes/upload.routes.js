import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import {User} from "../models/user.model.js";
// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize AWS S3 Client (v3)
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const upload = multer({
	storage: multer.memoryStorage(), 
});

const uploadToS3 = async (buffer, fileName, mimeType) => {
	const uploadParams = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: mimeType, // Use the appropriate MIME type
	};

	try {
		// Upload file to S3 using PutObjectCommand
		const command = new PutObjectCommand(uploadParams);
		const data = await s3.send(command);
		return data;
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw new Error("Failed to upload file to S3");
	}
};

router.post("/upload", upload.single("image"), async (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded");
	}
	const userId = req.body.userId;
	if (!userId) {
		return res.status(401).send("Unauthorized");
	}
	try {
		const { buffer, originalname, mimetype } = req.file;
		const fileName = `${Date.now()}_${originalname}`;

		// Upload to S3 directly from memory
		const uploadResponse = await uploadToS3(buffer, fileName, mimetype);
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

		const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }
        user.tshirt.push(fileUrl); 
        await user.save();

		res.status(200).send({
			message: "File uploaded successfully",
			fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Error uploading file to S3");
	}
});

router.get("/test", (req, res) => {
	res.json({ message: "Server is up and running" });
});

export default router;
