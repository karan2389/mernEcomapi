const uploadController = require("express").Router();

const multer = require("multer");
const { verifyToken } = require("../middlewares/verifyToken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.filename);
  },
});

const upload = multer({
  storage,
});

uploadController.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    try {
      return res.status(200).json({ msg: "successfully uploaded file" });
    } catch (error) {
      console.error(error.message);
    }
  }
);

module.exports = uploadController; 
