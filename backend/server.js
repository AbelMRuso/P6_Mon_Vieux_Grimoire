const http = require("http");
const app = require("./app");

// Crear servidor HTTP usando la app de Express
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

module.exports = app;
