import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { connectToSocket } from './controllers/socketManager.js';
import cors from 'cors';
import userRoutes from './routes/userroutes.js';




// Load environment variables from .env file
dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
mongoose.set('strictQuery', true);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

const start = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGO_URL) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }

        // Connect to MongoDB
        const connectionDb = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

        // Start server
        server.listen(app.get("port"), () => {
            console.log(`Server is running on port ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Error starting server or connecting to database:", error);
    }
};

start();
