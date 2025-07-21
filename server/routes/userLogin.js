const express = require("express");
const {
  registration,
  login,
  logout,
  profileUpdate,
} = require("../controller/user.controller");
const authUser = require("../middleware/authUser");
const { singleUpload } = require("../middleware/multer");
const router = express.Router();
router.post("/register", singleUpload, registration);
router.post("/login", login);
router.post("/logout", logout);
router.post("/profile/update", authUser, singleUpload, profileUpdate);
module.exports = router;
