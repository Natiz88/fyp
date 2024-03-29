const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `user-${req.user_id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  let error = isValid ? null : new Error("Invalid mime type!");
  cb(error, isValid);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadSinglePhoto = upload.single("user_image");
