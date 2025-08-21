const express = require("express");
const bookCtrl = require("../controllers/book.controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");

const router = express.Router();

router.post("/:id/rating", bookCtrl.rateBook);
router.post("/", auth, multer, bookCtrl.uploadBook);

router.get("/bestrating", bookCtrl.getBestRated); // más específico
router.get("/", bookCtrl.getAllBooks); // listado completo
router.get("/:id", bookCtrl.getOneBook); // detalle por id

router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
