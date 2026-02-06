// /**
//  * Database Migration Script
//  * Adds feedScore to existing products for infinite scroll
//  * 
//  * Usage:
//  * node scripts/migrateFeedScores.js
//  */

// const mongoose = require('mongoose');
// require('dotenv').config();

// // Import your Product model
// // const { Product } = require('../models/Product'); // Adjust path as needed
// const { Product } = require('../model/Product'); // Adjust path as needed

// // MongoDB connection
// const MONGODB_URI = "mongodb://127.0.0.1:27017/ecommerce" || 'your-mongodb-connection-string';

// async function migrateFeedScores() {
//   try {
//     console.log('🚀 Starting feed score migration...');
    
//     // Connect to MongoDB
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ Connected to MongoDB');

//     // Find products without feedScore
//     const productsWithoutScore = await Product.find({
//       $or: [
//         { feedScore: { $exists: false } },
//         { feedScore: null }
//       ]
//     });

//     console.log(`📊 Found ${productsWithoutScore.length} products without feedScore`);

//     if (productsWithoutScore.length === 0) {
//       console.log('✨ All products already have feedScores!');
//       process.exit(0);
//     }

//     // Update products in batches
//     const BATCH_SIZE = 100;
//     let updated = 0;

//     for (let i = 0; i < productsWithoutScore.length; i += BATCH_SIZE) {
//       const batch = productsWithoutScore.slice(i, i + BATCH_SIZE);
      
//       const bulkOps = batch.map(product => {
//         // Create a consistent but random score
//         // Uses product ID hash + timestamp for stability
//         const idHash = product._id.toString().split('').reduce(
//           (acc, char) => acc + char.charCodeAt(0),
//           0
//         );
        
//         const timestamp = product.createdAt 
//           ? new Date(product.createdAt).getTime()
//           : Date.now();
        
//         const feedScore = timestamp + (idHash % 10000);

//         return {
//           updateOne: {
//             filter: { _id: product._id },
//             update: { $set: { feedScore } }
//           }
//         };
//       });

//       await Product.bulkWrite(bulkOps);
//       updated += batch.length;
      
//       console.log(`⏳ Updated ${updated}/${productsWithoutScore.length} products...`);
//     }

//     console.log(`✅ Successfully updated ${updated} products with feedScores`);

//     // Create indexes
//     console.log('📇 Creating indexes...');
//     await Product.collection.createIndex({ feedScore: -1, _id: 1 });
//     await Product.collection.createIndex({ rating: -1, _id: 1 });
//     await Product.collection.createIndex({ discountPrice: -1, _id: 1 });
//     await Product.collection.createIndex({ price: -1, _id: 1 });
//     await Product.collection.createIndex({ discountPrice: 1, _id: 1 });
//     await Product.collection.createIndex({ price: 1, _id: 1 });
//     console.log('✅ Indexes created successfully');

//     // Verify
//     const allProducts = await Product.countDocuments();
//     const productsWithScore = await Product.countDocuments({
//       feedScore: { $exists: true, $ne: null }
//     });

//     console.log('\n📊 Migration Summary:');
//     console.log(`   Total products: ${allProducts}`);
//     console.log(`   Products with feedScore: ${productsWithScore}`);
//     console.log(`   Success rate: ${((productsWithScore / allProducts) * 100).toFixed(2)}%`);

//     if (productsWithScore === allProducts) {
//       console.log('\n🎉 Migration completed successfully!');
//     } else {
//       console.log('\n⚠️  Some products still missing feedScore');
//     }

//   } catch (error) {
//     console.error('❌ Migration failed:', error);
//     process.exit(1);
//   } finally {
//     await mongoose.connection.close();
//     console.log('👋 Database connection closed');
//     process.exit(0);
//   }
// }

// // Alternative: Update ALL products with new feedScores (use with caution)
// async function regenerateFeedScores() {
//   try {
//     console.log('🔄 Regenerating ALL feed scores...');
    
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const allProducts = await Product.find({});
//     console.log(`📊 Found ${allProducts.length} products`);

//     const bulkOps = allProducts.map(product => {
//       const idHash = product._id.toString().split('').reduce(
//         (acc, char) => acc + char.charCodeAt(0),
//         0
//       );
      
//       const timestamp = Date.now();
//       const feedScore = timestamp + (idHash % 10000) + Math.floor(Math.random() * 1000);

//       return {
//         updateOne: {
//           filter: { _id: product._id },
//           update: { $set: { feedScore } }
//         }
//       };
//     });

//     await Product.bulkWrite(bulkOps);
//     console.log(`✅ Regenerated feedScores for ${allProducts.length} products`);

//   } catch (error) {
//     console.error('❌ Regeneration failed:', error);
//   } finally {
//     await mongoose.connection.close();
//     process.exit(0);
//   }
// }

// // Run migration
// if (require.main === module) {
//   const args = process.argv.slice(2);
  
//   if (args.includes('--regenerate')) {
//     console.log('⚠️  Running in REGENERATE mode - this will update ALL products');
//     regenerateFeedScores();
//   } else {
//     migrateFeedScores();
//   }
// }

// module.exports = { migrateFeedScores, regenerateFeedScores };