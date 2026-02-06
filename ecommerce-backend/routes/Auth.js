const express = require("express");
const { cloudinary } = require("../services/cloudinaryconfig");
const multer = require("multer");
const { User } = require("../model/User");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET_KEY;

const {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  logout,
} = require("../controller/Auth");

const router = express.Router();
//  /auth is already added in base path

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

// router
//   .post("/signup", upload.single("imageFile"), async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
//     try {
//       const upload = await cloudinary.uploader.upload(req.file.path);

//       const { email, firstName, lastName } = req.body;

//       const salt = crypto.randomBytes(16);
//       crypto.pbkdf2(
//         req.body.password,
//         salt,
//         310000,
//         32,
//         "sha256",
//         async function (err, hashedPassword) {
//           const user = new User({
//             email,
//             firstName,
//             lastName,
//             password: hashedPassword,
//             imgpath: upload.secure_url,
//             salt,
//           });
//           const doc = await user.save();

//           req.login(sanitizeUser(doc), (err) => {
//             // this also calls serializer and adds to session
//             if (err) {
//               res.status(400).json(err);
//             } else {
//               const token = jwt.sign(
//                 sanitizeUser(doc),
//                 process.env.JWT_SECRET_KEY
//               );
//               res
//                 .cookie("jwt", token, {
//                   expires: new Date(Date.now() + 3600000),
//                   httpOnly: true,
//                 })
//                 .status(201)
//                 .json({ id: doc.id, role: doc.role });
//             }
//           });
//         }
//       );
//     } catch (err) {
//       console.log("err", err);
//       res.status(400).json(err);
//     }
//   })

// router
//   .post("/signup", upload.single("imageFile"), async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
//     try {
//       const upload = await cloudinary.uploader.upload(req.file.path);

//       const { email, firstName, lastName, password } = req.body;

//       const oldUser = await User.findOne({ email });

//       if (oldUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 12);

//       const result = await User.create({
//         email,
//         firstName,
//         lastName,
//         password: hashedPassword,
//         imgpath: upload.secure_url,
//       });

//       const token = jwt.sign(
//         { email: result.email, id: result._id },
//         jwtSecret,
//         {
//           expiresIn: "8h",
//         }
//       );
//       res.status(201).json({ result, token });

//       // const salt = crypto.randomBytes(16);
//       // crypto.pbkdf2(
//       //   req.body.password,
//       //   salt,
//       //   310000,
//       //   32,
//       //   "sha256",
//       //   async function (err, hashedPassword) {
//       //     const user = new User({
//       //       email,
//       //       firstName,
//       //       lastName,
//       //       password: hashedPassword,
//       //       imgpath: upload.secure_url,
//       //       salt,
//       //     });
//       //     const doc = await user.save();

//       //     req.login(sanitizeUser(doc), (err) => {
//       //       // this also calls serializer and adds to session
//       //       if (err) {
//       //         res.status(400).json(err);
//       //       } else {
//       //         const token = jwt.sign(
//       //           sanitizeUser(doc),
//       //           process.env.JWT_SECRET_KEY
//       //         );
//       //         res
//       //           .cookie("jwt", token, {
//       //             expires: new Date(Date.now() + 3600000),
//       //             httpOnly: true,
//       //           })
//       //           .status(201)
//       //           .json({ id: doc.id, role: doc.role });
//       //       }
//       //     });
//       //   }
//       // );
//     } catch (err) {
//       console.log("err", err);
//       res.status(400).json(err);
//     }
//   })
router.post("/signup", upload.single("imageFile"), async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let imageUrl = null;

    // ✅ Upload image only if provided
    if (req.file) {
      const cloudUpload = await cloudinary.uploader.upload(req.file.path);
      imageUrl = cloudUpload.secure_url;

      // cleanup local file
      fs.unlinkSync(req.file.path);
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      imgpath: imageUrl,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imgpath: user.imgpath,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})
  .post("/login", loginUser)
  .get("/check", checkAuth)
  .get("/logout", logout)
  .post("/reset-password-request", resetPasswordRequest)
  .post("/reset-password", resetPassword);
exports.router = router;
