const { JsonWebTokenError } = require("jsonwebtoken");
const User = require("../model/user.model");
const cloudinary = require("../utils/cloudnary");
const getDataUri = require("../utils/detauri");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });
const registration = async (req, res) => {
  try {
    const { fullName, email, phoneNo, password, role } = req.body;

    if (!fullName || !email || !phoneNo || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existedUSer = await User.findOne({ email: email });
    if (existedUSer) {
      return res.status(400).json({
        message: "User Alredy existed in DB",
        success: false,
      });
    }

    const file = req.file;
    let cloudResponse = "";
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    let url = null;
    if (file && cloudResponse) {
      url = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phoneNo,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: url,
      },
    });
    return res.status(201).json({
      message: "Account Created",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "email or password is incorrect",
        success: false,
      });
    }
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "user does not exist",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch || role != user.role) {
      return res.status(400).json({
        message: "Incorrect credintials",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNo,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "loged out succesfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
const profileUpdate = async (req, res) => {
  try {
    const { fullName, phoneNo, bio, skills, email} = req.body;
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  registration,
  login,
  logout,
  profileUpdate,
};
