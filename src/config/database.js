import mongoose from "mongoose";

// async await : when one task finishes only then will the next task start
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGO_URI}`)
        console.log(`\n MongoDB connected !!! 
            ${connectionInstance.connection.host}`);
    } catch (error) {
       console.log("MongoDB connection failed", error)
       process.exit(1) 
    }

}

export default connectDB;
