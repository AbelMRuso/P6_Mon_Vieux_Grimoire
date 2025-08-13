const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true }, //USER ID DEBE RELACIONARSE CON EL SCHEMA USER Y SU ID
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userID: { type: String, required: true },
            grade: { type: Number, required: true },
        },
    ],
    averageRating: { type: Number },
});

module.exports = mongoose.model("Book", bookSchema);
