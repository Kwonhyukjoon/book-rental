const express = require("express");
const auth = require("../middleware/auth");
const {
  getBooks,
  rentBook,
  getMyBooks,
  returnBook,
} = require("../controllers/books");
const router = express.Router();

router.route("/").get(getBooks);
router.route("/rent").post(auth, rentBook);
router.route("/me").get(auth, getMyBooks);
router.route("/return").delete(auth, returnBook);

module.exports = router;
