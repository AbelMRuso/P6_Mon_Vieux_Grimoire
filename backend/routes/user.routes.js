const express = require("express");
const userCtrl = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", userCtrl.userSignUp);
router.post("/login", userCtrl.userLogIn);

module.exports = router;
