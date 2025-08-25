require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
const bookRoutes = require("./routes/book.routes");
const userRoutes = require("./routes/user.routes");

connectDB();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
