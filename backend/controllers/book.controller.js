const Book = require("../models/Book");

exports.uploadBook = async (req, res, next) => {
    res.json("Postear un libro");
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

//CONTROLADOR A REVISAR CON RESPECTO A LA RECUPERACIÓN DEL ID DE LA URL
exports.getOneBook = async (req, res) => {
    res.json("Recupera un libro para mostrarlo en pantalla con los detalles");
    /* Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error })); */
};

exports.modifyBook = async (req, res) => {
    res.json("Modificar el libro con un id concreto");
};

exports.getAllBooks = async (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = async (req, res) => {
    res.json("Suprimir un libro");
};
