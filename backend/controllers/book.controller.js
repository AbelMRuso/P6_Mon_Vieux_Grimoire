const Book = require("../models/Book");

//  NUEVO CONTROLADOR PARA SUBIR LIBROS TENIENDO EN CUENTA LA IMAGEN
exports.uploadBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
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
