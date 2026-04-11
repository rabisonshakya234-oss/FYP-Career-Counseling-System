const path = require("path"); // works with files and directory.
// creates a file system in express js.
const fs = require("fs"); 
const multer = require("multer");

//  saves the uploaded profile picture in  given pathname or directory.
const uploadPath = path.join(__dirname, "..", "uploads", "profile");

fs.mkdirSync(uploadPath, { recursive: true });

// creating the diskstorage using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // stores the image in orginal file extension
        const ext = path.extname(file.originalname);
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, file.fieldname + "-" + uniqueSuffix);
        
    },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = { uploadMiddleware };