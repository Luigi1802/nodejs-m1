const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connection successful");
    } catch (error) {
        console.log("Databe connection error", error);
        process.exit(1);
    }
}

module.exports = connectDB;