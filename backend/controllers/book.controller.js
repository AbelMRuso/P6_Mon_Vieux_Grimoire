const Book = require("../models/Book");

exports.uploadBook = async (req, res, next) => {
    const book = new Book({
        ...req.body,
    });
    book.save()
        .then(() => res.status(201).json({ message: "libro registrado" }))
        .catch((error) => res.status(404).json({ error }));
};

exports.rateBook = async (req, res, next) => {
    res.json("Valorar un libro");
};

exports.getBestRated = async (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = async (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = async (req, res) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Libro modificado correctamente" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = async (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = async (req, res) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "El libro se ha suprimido correctamente" }))
        .catch((error) => res.status(400).json({ error }));
};
