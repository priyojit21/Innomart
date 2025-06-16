import path from "path";
import multer from "multer";
import { statusCode } from "../config/constant.js";

const imageExtension = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: `./uploads/${folder}`,
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const originalName = path.basename(file.originalname, ext);
      cb(null, `${originalName}` + "-" + Date.now() + `${ext}`);
    },
  });
};

const fileValidation = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only PNG and JPEG is allowed!"), false);
    }
  };
};

//Video Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const videoUpload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
  fileFilter: (req, file, cb) => {
      const filetypes = /mp4|mkv|avi|mov/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb("Error: Video file type not supported [.mp4, .mkv, .avi, .mov] are allowed");
      }
  }
});

export const uploadProductVideo = (req, res, next) => {
  videoUpload.single('productVideo')(req, res, (err) => {
      if (err) {
          console.error("Multer error:", err);
          return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Error uploading video: " + err.message
          });
      }
      next();
  });
};

export const profileUpload = multer({
  storage:createStorage('user'),
  fileFilter: fileValidation(imageExtension),
});

export const logoUpload = multer({
  storage:createStorage('business'),
  fileFilter: fileValidation(imageExtension),
});

export const idUpload = multer({
  storage:createStorage('business'),
  fileFilter: fileValidation(imageExtension),
});

export const licenseUpload = multer({
  storage:createStorage('business'),
  fileFilter: fileValidation(imageExtension),
});


export const productImageUpload = multer({
  storage: createStorage("product"),
  fileFilter: fileValidation(imageExtension),
});

// Error handling middleware
export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
