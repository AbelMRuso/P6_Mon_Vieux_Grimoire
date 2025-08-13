const express = require("express");
const bookCtrl = require("../controllers/book.controller");

const router = express.Router();

/* app.get("/api/books", (req, res) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
});
 */
router.get("/", bookCtrl.getAllBooks);
