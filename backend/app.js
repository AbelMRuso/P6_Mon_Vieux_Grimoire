require("dotenv").config();

const express = require("express");
const app = express();

const Book = require("./models/Book");

//Conexión con la base de datos
const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// CONFIGURACIÓN CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Middleware para leer JSON y lo mete en body
app.use(express.json());

// Aquí irán las rutas, middlewares adicionales, etc.

//MIDDLEWARE POST
app.post("/api/auth/signup", (req, res, next) => {
    res.json("Creación de usuario");
});
app.post("/api/auth/login", (req, res, next) => {
    res.json("Login de usuario");
});

app.post("/api/books", (req, res, next) => {
    res.json("Postear un libro");
});

app.post("/api/books/:id/rating", (req, res, next) => {
    res.json("Valorar un libro");
});

//MIDDLEWARE GET
app.get("/api/books/bestrating", (req, res) => {
    Book.find()
        .sort({ averageRating: -1 })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
});

app.get("/api/books/:id", (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
});

app.get("/api/books", (req, res) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
});

//MIDDLEWARE PUT
app.put("/api/books/:id", (req, res) => {
    res.json("Modificar el libro con un id concreto");
});

//MIDDLEWARE DELETE
app.delete("/api/books/:id", (req, res) => {
    res.json("Suprimir un libro");
});

module.exports = app;
