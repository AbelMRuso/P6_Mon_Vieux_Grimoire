require("dotenv").config();

const express = require("express");
const app = express();
const bookRoutes = require("./routes/book.routes");
const userRoutes = require("./routes/user.routes");

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

app.use("/api/books", bookRoutes); //asocia todas las rutas que emipezan por /api/books
app.use("/api/auth", userRoutes);
/* app.use("/images", express.static(this.path.join(__dirname, "images")));  */ // SE SUPONE QUE RECUPERA LA IMAGEN Y LA MUESTRA EN PANTALLA
module.exports = app;
