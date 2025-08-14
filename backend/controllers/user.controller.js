const bcrypt = require("bcrypt");
const User = require("../models/User");

//REVISAR YA QUE POSTMAN MANDA UN ERROR 400 AL INTENTAR REGISTRAR A UN USUARIO
exports.userSignup = async (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json({ message: "Usuario creado" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.userLogin = async (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user === null) {
                res.status(401).json({ message: "Usuario o contraseña incorrectas" });
            } else {
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({ message: "Usuario o contraseña incorrectas" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: "TOKEN",
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
