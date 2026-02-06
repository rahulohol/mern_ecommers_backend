// const mongoose = require("mongoose");
// // const { Product } = require("/models/Product"); // adjust path if needed
// const { Product } = require("../model/Product"); // adjust path if needed

// // const MONGO_URI = "mongodb://127.0.0.1:27017/your_db_name"; // 🔴 change this

// async function runMigration() {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
//     console.log("MongoDB connected");

//     const result = await Product.updateMany(
//       { feedScore: { $exists: false } },
//       [
//         {
//           $set: {
//             feedScore: { $toLong: "$createdAt" },
//           },
//         },
//       ]
//     );

//     console.log("Migration completed:", result.modifiedCount, "documents updated");
//     process.exit(0);
//   } catch (err) {
//     console.error("Migration failed", err);
//     process.exit(1);
//   }
// }

// runMigration();
