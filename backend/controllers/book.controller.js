const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

exports.uploadBook = async (req, res, next) => {
    try {
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
        await book.save();
        res.status(201).json({ message: "Livre enregistré !", book });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.rateBook = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const bookId = req.params.id;
        const { rating } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Livre introuvable" });
        }

        const alreadyRated = book.ratings.some((r) => r.userId.toString() === userId);
        if (alreadyRated) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
        }

        book.ratings.push({ userId, grade: rating });

        const totalRating = book.ratings.reduce((acc, r) => acc + r.grade, 0);
        book.averageRating = Math.round(totalRating / book.ratings.length);

        await book.save();
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur" });
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
    try {
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

        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        if (req.file && book.imageUrl) {
            const oldFilename = book.imageUrl.split("/images/")[1];
            await fs.promises.unlink(`images/${oldFilename}`);
        }

        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

        res.status(200).json({ message: "Livre modifié" });
    } catch (error) {
        res.status(400).json({ error });
    }
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
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: "Non autorisé" });
        }

        if (book.imageUrl) {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);
        }

        await Book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur", error });
    }
};
