import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("CONNECTION TO DB")
    } catch (error) {
        console.log("CONNECTION ERROR :: ", error)
    }
}

export default connectMongoDB;