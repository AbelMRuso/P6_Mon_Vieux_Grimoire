const express = require("express");
const bookCtrl = require("../controllers/book.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, bookCtrl.uploadBook);
router.post("/:id/rating", bookCtrl.rateBook);

router.get("/bestrating", bookCtrl.getBestRated); // más específico
router.get("/", bookCtrl.getAllBooks); // listado completo
router.get("/:id", bookCtrl.getOneBook); // detalle por id

router.put("/:id", auth, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
