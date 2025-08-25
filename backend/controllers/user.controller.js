const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json({ error: error.message });
        } else if (error.code === 11000) {
            res.status(409).json({ error: "Cet e-mail est déjà enregistré." });
        } else {
            res.status(500).json({ error: "Erreur de serveur" });
        }
    }
};

exports.userLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "mail ou mot de passe incorrects" });
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "mail ou mot de passe incorrects" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "24h" });

        res.status(200).json({ userId: user._id, token });
    } catch (error) {
        res.status(500).json({ error: "Erreur de serveur" });
    }
};
