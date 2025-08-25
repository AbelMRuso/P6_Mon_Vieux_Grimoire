const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error("❌ Erreur de connexion avec MongoDB:", err);
    }
};

module.exports = connectDB;
