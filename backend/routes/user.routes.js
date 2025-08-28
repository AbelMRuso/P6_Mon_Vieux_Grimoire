const express = require("express");
const userCtrl = require("../controllers/user.controller");
const limiter = require("../middleware/limiter");

const router = express.Router();

router.post("/signup", userCtrl.userSignup);
router.post("/login", limiter, userCtrl.userLogin);

module.exports = router;
