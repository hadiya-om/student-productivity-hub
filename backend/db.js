const mongoose = require("mongoose");

async function connectDB() {
try {
await mongoose.connect("mongodb://127.0.0.1:27017/dayora");
console.log("MongoDB connected to Dayora!");
} catch (error) {
console.error("MongoDB connection failed:", error.message);
}
}

module.exports = connectDB;
