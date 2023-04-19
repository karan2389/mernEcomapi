const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const uploadController = require("./controllers/uploadController");
const port = process.env.PORT || 4000

const app = express();

dotenv.config();

//MONGODB CONNECTION
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongodb.");
  } catch (error) {
    console.error(error);
  }
};

//ROUTES & MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("public/images"));
app.use("/auth", authController);
app.use("/product", productController);
app.use("/upload", uploadController);

//SERVER SETUP
app.listen(4000, () => {
  connect();
  console.log("Connected to backend!!");
});
