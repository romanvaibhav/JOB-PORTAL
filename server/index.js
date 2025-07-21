const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require("./routes/userLogin");
const connectDB = require("./utils/connectDB");
const dotenv = require("dotenv");

const PORT = 4002;
const app = express();
connectDB();

//middlEWARE
dotenv.config({ quiet: true });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/user", router);

app.listen(PORT, () => {
  console.log(`server started at port:${PORT}`);
});
