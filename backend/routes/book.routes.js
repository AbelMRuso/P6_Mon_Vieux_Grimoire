const express = require("express");
const bookCtrl = require("../controllers/book.controller");

const router = express.Router();

router.post("/", bookCtrl.uploadBook);
router.post("/:id/rating", bookCtrl.rateBook);
router.get("/bestrating", bookCtrl.getBestRated);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", bookCtrl.modifyBook);
router.delete("/:id", bookCtrl.deleteBook);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
