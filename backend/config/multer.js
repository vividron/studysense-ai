import multer from "multer"
import {fileURLToPath} from 'url'
import path from "path";
import fs from 'fs';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const uploadPath = path.join(_dirname, '../uploads');
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {  // Only allow PDf document
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        }
        else{
            cb(new Error("Document should be in PDF format"), false);
        }
    },
    limits: {
        fileSize: 10485760 // 10MB size
    }
});

export default upload;