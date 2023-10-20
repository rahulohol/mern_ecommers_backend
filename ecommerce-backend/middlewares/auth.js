// import jwt from "jsonwebtoken";
// import UserModel from "../models/user.js";
const { User } = require("../model/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// dotenv.config();
// const secret = "test";
const secret = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      const googleId = decodedData?.sub.toString();
      const user = await User.findOne({ googleId });
      req.userId = user?._id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.isAuth = auth;
