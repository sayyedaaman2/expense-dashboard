import mongoose from 'mongoose';

let isConnected:boolean = false;
const MONGODB_URI= process.env.MONGODB_URI!;
if(!MONGODB_URI || typeof(MONGODB_URI) !== "string"){
    throw new Error("MONGODB_URI is not defined.")
}


export async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URI);

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected.");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        isConnected = true;
        
    } catch (error) {
        // Critical error. We *must* reset `isConnected` so future attempts can retry.
        isConnected = false;

        console.error("Failed to connect to MongoDB:", error);

        // Re-throw so the caller knows the connection failed.
        throw error;
    }
}