const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, //USER ID DEBE RELACIONARSE CON EL SCHEMA USER Y SU ID
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userID: { type: mongoose.Schema.Types.ObjectId, required: true },
            grade: { type: Number, required: true },
        },
    ],
    averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model("Book", bookSchema);
