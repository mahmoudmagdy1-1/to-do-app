const mongoose = require("mongoose")
const dotenv = require('dotenv').config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,
        {
            dbName: "to-do-app",
        }
    )
        console.log("Connected to database!")
    } catch (error) {
        console.error(error)
    }
}

module.exports = { connectDB }