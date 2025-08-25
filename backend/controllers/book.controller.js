const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

//  REVISAR PASOS PARA OPTIMIZACIÓN DE IMAGEN Y APLICARLO TAMBIÉN EN LA MODIFICACIÓN
exports.uploadBook = async (req, res, next) => {
    const filePath = req.file.path;
    const outputPath = filePath.replace(path.extname(filePath), ".webp");

    await sharp(filePath).webp({ quality: 80 }).toFile(outputPath);

    fs.unlinkSync(filePath);

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${path.basename(outputPath)}`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !", book });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//A VERIFICAR!!
exports.rateBook = async (req, res, next) => {
    //Aqui empezamos la valoración del libro

    try {
        const userId = req.auth.userId;
        const bookId = req.params.id;
        const { rating } = req.body;

        console.log("Body recibido:", req.body);
        console.log("Book ID recibido:", bookId);
        console.log("Grade recibido:", rating);

        // Recuperar el libro
        const book = await Book.findById(bookId);
        console.log("Libro encontrado:", book);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Comprobar si el usuario ya ha valorado
        const alreadyRated = book.ratings.some((r) => r.userId.toString() === userId);
        if (alreadyRated) {
            return res.status(400).json({ message: "Ya has valorado este libro" });
        }

        //agrega la valoración del usuario
        book.ratings.push({ userId, grade: rating });

        //recalcula la nota media
        const totalRating = book.ratings.reduce((acc, r) => acc + r.grade, 0);
        book.averageRating = Math.round(totalRating / book.ratings.length);

        console.log("Ratings actualizados:", book.ratings);
        console.log("Nueva nota media:", book.averageRating);

        //guardar cambios
        await book.save();
        res.status(200).json(book);
    } catch (error) {
        console.error("Error en rateBook:", error);
        res.status(500).json({ message: "Error al procesar la valoración", error: error.message });
    }
};

exports.getBestRated = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur" });
    }
};

exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            return res.status(404).json({ message: "livre introuvable" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.modifyBook = async (req, res) => {
    let bookObject = { ...req.body };

    if (req.file) {
        const filePath = req.file.path;
        const outputPath = filePath.replace(path.extname(filePath), ".webp");

        await sharp(filePath).webp({ quality: 80 }).toFile(outputPath);
        fs.unlinkSync(filePath);

        bookObject = {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${path.basename(outputPath)}`,
        };
    }

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "no autorizado" });
            } else {
                if (req.file) {
                    const oldFilename = book.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${oldFilename}`, (error) => {
                        if (error) res.status(401).json({ error });
                    });
                }
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "libro modificado" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur" });
    }
};

exports.deleteBook = async (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "no autorizado" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "libro suprimido" }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
