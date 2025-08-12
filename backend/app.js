const express = require("express");
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Aquí irán las rutas, middlewares adicionales, etc.
app.get("/api/books", (req, res) => {
    res.send("enviará un array de los libtos en la base de datos");
});

app.post("/api/books", (req, res) => {
    res.send("mediante autenticación permitirá subir un libro con string e imagen");
});

// app.use("/api", require("./routes"));

module.exports = app;
