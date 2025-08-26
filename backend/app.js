require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("./middleware/cors");
const path = require("path");
const app = express();
const bookRoutes = require("./routes/book.routes");
const userRoutes = require("./routes/user.routes");

connectDB();

app.use(cors);
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
