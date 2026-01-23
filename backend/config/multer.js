import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Document should be in PDF format"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB size
  }
});

export default upload;
