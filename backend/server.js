const express = require("express");
const app = express();

// middleware to read JSON in request
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor Express funcionando 🚀");
});

// Puerto y arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
