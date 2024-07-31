const { fstat } = require('fs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (req.baseUrl.includes('product')) {
      uploadPath += 'products/';
    } else if (req.baseUrl.includes('user')) {
      uploadPath += 'users/';
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({ storage: storage });

module.exports = upload;
