const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This is the middleware for handling single file upload
const singleUpload = upload.single("profilephoto");
module.exports = { singleUpload };
