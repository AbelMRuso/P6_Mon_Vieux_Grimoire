const User = require("../models/User");

exports.userSignUp = async (req, res, next) => {
    res.json("Creación de usuario");
};

exports.userLogIn = async (req, res, next) => {
    res.json("Login de usuario");
};
