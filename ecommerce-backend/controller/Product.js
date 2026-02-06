// // const { Product } = require('../model/Product');

// // exports.createProduct = async (req, res) => {
// //   // this product we have to get from API body
// //   const product = new Product(req.body);
// //   product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
// //   try {
// //     const doc = await product.save();
// //     res.status(201).json(doc);
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };

// // exports.fetchAllProducts = async (req, res) => {
// //   // filter = {"category":["smartphone","laptops"]}
// //   // sort = {_sort:"price",_order="desc"}
// //   // pagination = {_page:1,_limit=10}
// //   let condition = {}
// //   if(!req.query.admin){
// //       condition.deleted = {$ne:true}
// //   }
  
// //   let query = Product.find(condition);
// //   let totalProductsQuery = Product.find(condition);

// //   console.log(req.query.category);

// //   if (req.query.category) {
// //     query = query.find({ category: {$in:req.query.category.split(',')} });
// //     totalProductsQuery = totalProductsQuery.find({
// //       category: {$in:req.query.category.split(',')},
// //     });
// //   }
// //   if (req.query.brand) {
// //     query = query.find({ brand: {$in:req.query.brand.split(',')} });
// //     totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',') }});
// //   }
// //   if (req.query._sort && req.query._order) {
// //     query = query.sort({ [req.query._sort]: req.query._order });
// //   }

// //   const totalDocs = await totalProductsQuery.count().exec();
// //   console.log({ totalDocs });

// //   if (req.query._page && req.query._limit) {
// //     const pageSize = req.query._limit;
// //     const page = req.query._page;
// //     query = query.skip(pageSize * (page - 1)).limit(pageSize);
// //   }

// //   try {
// //     const docs = await query.exec();
// //     res.set('X-Total-Count', totalDocs);
// //     res.status(200).json(docs);
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };

// // exports.fetchAllProducts = async (req, res) => {
// //   let condition = {};
// //   if (!req.query.admin) {
// //     condition.deleted = { $ne: true };
// //   }

// //   const page = Number(req.query._page || 1);
// //   const limit = Number(req.query._limit || 10);

// //   const hasFilters = req.query.category || req.query.brand;

// //   try {
// //     // 🔥 CASE 1: NO category & NO brand → RANDOM MIX
// //     if (!hasFilters) {
// //       const docs = await Product.aggregate([
// //         { $match: condition },
// //         { $sample: { size: limit * page } }, // random mix
// //       ]);

// //       const paginatedDocs = docs.slice(
// //         (page - 1) * limit,
// //         page * limit
// //       );

// //       const totalDocs = await Product.countDocuments(condition);

// //       res.set("X-Total-Count", totalDocs);
// //       return res.status(200).json(paginatedDocs);
// //     }

// //     // 🔥 CASE 2: Filters applied → normal behavior
// //     let query = Product.find(condition);
// //     let totalProductsQuery = Product.find(condition);

// //     if (req.query.category) {
// //       const categories = req.query.category.split(",");
// //       query = query.find({ category: { $in: categories } });
// //       totalProductsQuery = totalProductsQuery.find({
// //         category: { $in: categories },
// //       });
// //     }

// //     if (req.query.brand) {
// //       const brands = req.query.brand.split(",");
// //       query = query.find({ brand: { $in: brands } });
// //       totalProductsQuery = totalProductsQuery.find({
// //         brand: { $in: brands },
// //       });
// //     }

// //     if (req.query._sort && req.query._order) {
// //       query = query.sort({ [req.query._sort]: req.query._order });
// //     }

// //     const totalDocs = await totalProductsQuery.countDocuments();

// //     query = query.skip(limit * (page - 1)).limit(limit);

// //     const docs = await query.exec();

// //     res.set("X-Total-Count", totalDocs);
// //     res.status(200).json(docs);
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };


// // exports.fetchAllProducts = async (req, res) => {
// //   try {
// //     const limit = Number(req.query._limit || 10);
// //     const cursor = req.query.cursor;

// //     let condition = { deleted: { $ne: true } };

// //     if (cursor) {
// //       condition.feedScore = { $lt: Number(cursor) };
// //     }

// //     const products = await Product.find(condition)
// //       .sort({ feedScore: -1, _id: 1 }) // 🔥 deterministic
// //       .limit(limit + 1)
// //       .lean();

// //     const hasNextPage = products.length > limit;
// //     const data = hasNextPage ? products.slice(0, limit) : products;

// //     const nextCursor = hasNextPage
// //       ? data[data.length - 1].feedScore
// //       : null;

// //     res.status(200).json({
// //       data,
// //       nextCursor,
// //     });
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // };

// // exports.fetchAllProducts = async (req, res) => {
// //   try {
// //     const limit = Number(req.query._limit || 10);
// //     const cursor = req.query.cursor ? Number(req.query.cursor) : null;

// //     let condition = { deleted: { $ne: true } };

// //     // Filters (optional)
// //     if (req.query.category) {
// //       condition.category = { $in: req.query.category.split(',') };
// //     }
// //     if (req.query.brand) {
// //       condition.brand = { $in: req.query.brand.split(',') };
// //     }

// //     if (cursor) {
// //       condition.feedScore = { $lt: cursor };
// //     }

// //     const products = await Product.find(condition)
// //       .sort({ feedScore: -1, _id: 1 })
// //       .limit(limit + 1);

// //     let nextCursor = null;

// //     if (products.length > limit) {
// //       const last = products.pop();
// //       nextCursor = last.feedScore;
// //     }

// //     res.status(200).json({
// //       data: products,
// //       nextCursor,
// //     });
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };




// // ============================================
// // WORLD-CLASS INFINITE SCROLL IMPLEMENTATION
// // ============================================
// // Features:
// // ✅ No duplicate products
// // ✅ Consistent ordering per session
// // ✅ Proper cursor-based pagination
// // ✅ Filter & sort support
// // ✅ Performance optimized
// // ============================================

// // exports.fetchAllProducts = async (req, res) => {
// //   try {
// //     const limit = Number(req.query._limit || 12);
// //     const cursor = req.query.cursor || null;
// //     const sortField = req.query._sort || 'feedScore';
// //     const sortOrder = req.query._order === 'asc' ? 1 : -1;

// //     // Base condition - exclude deleted products
// //     let condition = { deleted: { $ne: true } };

// //     // ===== FILTERS =====
// //     if (req.query.category) {
// //       condition.category = { $in: req.query.category.split(',') };
// //     }
// //     if (req.query.brand) {
// //       condition.brand = { $in: req.query.brand.split(',') };
// //     }

// //     // ===== SORTING LOGIC =====
// //     let sortCriteria = {};
// //     let cursorCondition = {};

// //     if (sortField === 'feedScore') {
// //       // Default feed - random-ish but consistent per session
// //       sortCriteria = { feedScore: -1, _id: 1 };
      
// //       if (cursor) {
// //         // Cursor format: "feedScore:_id"
// //         const [cursorFeedScore, cursorId] = cursor.split(':');
// //         cursorCondition = {
// //           $or: [
// //             { feedScore: { $lt: Number(cursorFeedScore) } },
// //             { 
// //               feedScore: Number(cursorFeedScore), 
// //               _id: { $gt: cursorId } 
// //             }
// //           ]
// //         };
// //       }
// //     } else if (sortField === 'rating') {
// //       // Sort by rating
// //       sortCriteria = { rating: sortOrder, _id: 1 };
      
// //       if (cursor) {
// //         const [cursorRating, cursorId] = cursor.split(':');
// //         if (sortOrder === -1) {
// //           cursorCondition = {
// //             $or: [
// //               { rating: { $lt: Number(cursorRating) } },
// //               { 
// //                 rating: Number(cursorRating), 
// //                 _id: { $gt: cursorId } 
// //               }
// //             ]
// //           };
// //         } else {
// //           cursorCondition = {
// //             $or: [
// //               { rating: { $gt: Number(cursorRating) } },
// //               { 
// //                 rating: Number(cursorRating), 
// //                 _id: { $gt: cursorId } 
// //               }
// //             ]
// //           };
// //         }
// //       }
// //     } else if (sortField === 'discountPrice' || sortField === 'price') {
// //       // Sort by price
// //       const priceField = sortField;
// //       sortCriteria = { [priceField]: sortOrder, _id: 1 };
      
// //       if (cursor) {
// //         const [cursorPrice, cursorId] = cursor.split(':');
// //         if (sortOrder === -1) {
// //           cursorCondition = {
// //             $or: [
// //               { [priceField]: { $lt: Number(cursorPrice) } },
// //               { 
// //                 [priceField]: Number(cursorPrice), 
// //                 _id: { $gt: cursorId } 
// //               }
// //             ]
// //           };
// //         } else {
// //           cursorCondition = {
// //             $or: [
// //               { [priceField]: { $gt: Number(cursorPrice) } },
// //               { 
// //                 [priceField]: Number(cursorPrice), 
// //                 _id: { $gt: cursorId } 
// //               }
// //             ]
// //           };
// //         }
// //       }
// //     }

// //     // Merge cursor condition with base condition
// //     if (Object.keys(cursorCondition).length > 0) {
// //       condition = { $and: [condition, cursorCondition] };
// //     }

// //     // ===== FETCH PRODUCTS =====
// //     const products = await Product.find(condition)
// //       .sort(sortCriteria)
// //       .limit(limit + 1)
// //       .lean(); // Use lean() for better performance

// //     // ===== CALCULATE NEXT CURSOR =====
// //     let nextCursor = null;
// //     let hasMore = false;

// //     if (products.length > limit) {
// //       hasMore = true;
// //       const lastProduct = products[limit - 1];
      
// //       // Create cursor based on sort field
// //       if (sortField === 'feedScore') {
// //         nextCursor = `${lastProduct.feedScore}:${lastProduct._id}`;
// //       } else if (sortField === 'rating') {
// //         nextCursor = `${lastProduct.rating}:${lastProduct._id}`;
// //       } else if (sortField === 'discountPrice') {
// //         nextCursor = `${lastProduct.discountPrice || 0}:${lastProduct._id}`;
// //       } else if (sortField === 'price') {
// //         nextCursor = `${lastProduct.price}:${lastProduct._id}`;
// //       }
      
// //       products.pop(); // Remove the extra item
// //     }

// //     // ===== CALCULATE DISCOUNT PRICES =====
// //     const productsWithPrices = products.map(product => {
// //       if (!product.discountPrice && product.price && product.discountPercentage) {
// //         product.discountPrice = Math.round(
// //           product.price * (1 - product.discountPercentage / 100)
// //         );
// //       }
// //       return product;
// //     });

// //     res.status(200).json({
// //       products: productsWithPrices,
// //       nextCursor,
// //       hasMore,
// //       count: productsWithPrices.length,
// //     });

// //   } catch (err) {
// //     console.error('Error fetching products:', err);
// //     res.status(400).json({ 
// //       error: 'Failed to fetch products',
// //       message: err.message 
// //     });
// //   }
// // };

// // // ===== HELPER: Generate feed scores for existing products =====
// // exports.generateFeedScores = async (req, res) => {
// //   try {
// //     const products = await Product.find({ feedScore: { $exists: false } });
    
// //     let updated = 0;
// //     for (const product of products) {
// //       // Create a pseudo-random but consistent score based on product ID
// //       // This ensures same products get same scores across requests
// //       const hash = product._id.toString().split('').reduce(
// //         (acc, char) => acc + char.charCodeAt(0), 
// //         0
// //       );
      
// //       // Add timestamp-based component for some variety
// //       const timestampScore = product.createdAt ? 
// //         new Date(product.createdAt).getTime() : 
// //         Date.now();
      
// //       product.feedScore = timestampScore + (hash % 10000);
// //       await product.save();
// //       updated++;
// //     }

// //     res.status(200).json({
// //       message: `Updated ${updated} products with feed scores`
// //     });

// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };


// // exports.fetchProductById = async (req, res) => {
// //   const { id } = req.params;
// //   console.log("Fetching product by id -> ", id);

// //   try {
// //     const product = await Product.findOne({ _id: id });
// //     console.log("Fetched product -> ", product);
// //     res.status(200).json(product);
// //   } catch (err) {
// //     console.log("err while fetching product by id -> ",err);
// //     res.status(400).json(err);
// //   }
// // };

// // exports.updateProduct = async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
// //     product.discountPrice = Math.round(product.price*(1-product.discountPercentage/100))
// //     const updatedProduct = await product.save()
// //     res.status(200).json(updatedProduct);
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };




// const { Product } = require('../model/Product');
// const crypto = require('crypto');

// // ============================================
// // HELPER FUNCTIONS FOR RANDOMIZATION
// // ============================================

// function generateSessionSeed(req) {
//   const sessionId = req.query.sessionId || crypto.randomBytes(16).toString('hex');
//   return sessionId;
// }

// function getProductScore(productId, sessionSeed) {
//   const hash = crypto
//     .createHash('md5')
//     .update(`${sessionSeed}-${productId}`)
//     .digest('hex');
//   return parseInt(hash.substring(0, 8), 16);
// }

// // ============================================
// // MAIN CONTROLLER FUNCTIONS
// // ============================================

// exports.createProduct = async (req, res) => {
//   const product = new Product(req.body);
//   try {
//     const doc = await product.save();
//     res.status(201).json(doc);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.fetchAllProducts = async (req, res) => {
//   try {
//     const limit = Number(req.query._limit || 12);
//     const cursor = req.query.cursor || null;
//     const sortField = req.query._sort || 'random';
//     const sortOrder = req.query._order === 'asc' ? 1 : -1;
    
//     const sessionId = generateSessionSeed(req);

//     let condition = { deleted: { $ne: true } };

//     // ===== ADMIN MODE =====
//     if (req.query.admin) {
//       condition = {};
//     }

//     // ===== FILTERS =====
//     if (req.query.category) {
//       condition.category = { $in: req.query.category.split(',') };
//     }
//     if (req.query.brand) {
//       condition.brand = { $in: req.query.brand.split(',') };
//     }

//     // ===== SORTING LOGIC =====
//     let products;
//     let nextCursor = null;
//     let hasMore = false;

//     if (sortField === 'random' || sortField === 'feedScore' || !sortField) {
//       // ===== RANDOM ORDER =====
//       let allProducts = await Product.find(condition).lean();
      
//       allProducts = allProducts.map(product => ({
//         ...product,
//         _sessionScore: getProductScore(product._id, sessionId)
//       }));
      
//       allProducts.sort((a, b) => b._sessionScore - a._sessionScore);
      
//       if (cursor) {
//         const [cursorScore, cursorId] = cursor.split(':');
//         const cursorIndex = allProducts.findIndex(
//           p => p._sessionScore === Number(cursorScore) && p._id.toString() === cursorId
//         );
        
//         if (cursorIndex !== -1) {
//           allProducts = allProducts.slice(cursorIndex + 1);
//         }
//       }
      
//       products = allProducts.slice(0, limit);
//       hasMore = allProducts.length > limit;
//       nextCursor = hasMore && products.length > 0
//         ? `${products[products.length - 1]._sessionScore}:${products[products.length - 1]._id}`
//         : null;
      
//       products = products.map(p => {
//         const { _sessionScore, ...product } = p;
//         return product;
//       });
      
//     } else if (sortField === 'rating') {
//       // ===== SORT BY RATING =====
//       let sortCriteria = { rating: sortOrder, _id: 1 };
//       let cursorCondition = {};
      
//       if (cursor) {
//         const [cursorRating, cursorId] = cursor.split(':');
//         if (sortOrder === -1) {
//           cursorCondition = {
//             $or: [
//               { rating: { $lt: Number(cursorRating) } },
//               { rating: Number(cursorRating), _id: { $gt: cursorId } }
//             ]
//           };
//         } else {
//           cursorCondition = {
//             $or: [
//               { rating: { $gt: Number(cursorRating) } },
//               { rating: Number(cursorRating), _id: { $gt: cursorId } }
//             ]
//           };
//         }
//       }
      
//       if (Object.keys(cursorCondition).length > 0) {
//         condition = { $and: [condition, cursorCondition] };
//       }
      
//       products = await Product.find(condition)
//         .sort(sortCriteria)
//         .limit(limit + 1)
//         .lean();
      
//       if (products.length > limit) {
//         hasMore = true;
//         const lastProduct = products[limit - 1];
//         nextCursor = `${lastProduct.rating}:${lastProduct._id}`;
//         products.pop();
//       }
      
//     } else if (sortField === 'discountPrice' || sortField === 'price') {
//       // ===== SORT BY PRICE =====
//       const priceField = sortField;
//       let sortCriteria = { [priceField]: sortOrder, _id: 1 };
//       let cursorCondition = {};
      
//       if (cursor) {
//         const [cursorPrice, cursorId] = cursor.split(':');
//         if (sortOrder === -1) {
//           cursorCondition = {
//             $or: [
//               { [priceField]: { $lt: Number(cursorPrice) } },
//               { [priceField]: Number(cursorPrice), _id: { $gt: cursorId } }
//             ]
//           };
//         } else {
//           cursorCondition = {
//             $or: [
//               { [priceField]: { $gt: Number(cursorPrice) } },
//               { [priceField]: Number(cursorPrice), _id: { $gt: cursorId } }
//             ]
//           };
//         }
//       }
      
//       if (Object.keys(cursorCondition).length > 0) {
//         condition = { $and: [condition, cursorCondition] };
//       }
      
//       products = await Product.find(condition)
//         .sort(sortCriteria)
//         .limit(limit + 1)
//         .lean();
      
//       if (products.length > limit) {
//         hasMore = true;
//         const lastProduct = products[limit - 1];
//         nextCursor = `${lastProduct[priceField] || 0}:${lastProduct._id}`;
//         products.pop();
//       }
//     }

//     // ===== CALCULATE DISCOUNT PRICES =====
//     const productsWithPrices = products.map(product => {
//       if (!product.discountPrice && product.price && product.discountPercentage) {
//         product.discountPrice = Math.round(
//           product.price * (1 - product.discountPercentage / 100)
//         );
//       }
//       return product;
//     });

//     res.status(200).json({
//       products: productsWithPrices,
//       nextCursor,
//       hasMore,
//       count: productsWithPrices.length,
//       sessionId,
//     });

//   } catch (err) {
//     console.error('Error fetching products:', err);
//     res.status(400).json({ 
//       error: 'Failed to fetch products',
//       message: err.message 
//     });
//   }
// };

// exports.fetchProductById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findById(id);
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };




const { Product } = require('../model/Product');
const crypto = require('crypto');

// ============================================
// HELPER FUNCTIONS FOR RANDOMIZATION
// ============================================

function generateSessionSeed(req) {
  const sessionId = req.query.sessionId || crypto.randomBytes(16).toString('hex');
  return sessionId;
}

function getProductScore(productId, sessionSeed) {
  const hash = crypto
    .createHash('md5')
    .update(`${sessionSeed}-${productId}`)
    .digest('hex');
  return parseInt(hash.substring(0, 8), 16);
}

// ============================================
// SEARCH HELPER FUNCTIONS
// ============================================

// Extract search terms and create query
function buildSearchQuery(searchTerm, includeDeleted = false) {
  const query = {};
  
  if (!includeDeleted) {
    query.deleted = { $ne: true };
  }
  
  if (searchTerm && searchTerm.trim()) {
    // MongoDB text search
    query.$text = { $search: searchTerm };
  }
  
  return query;
}

// Get popular search terms (for search suggestions)
async function getPopularSearches(limit = 10) {
  try {
    // Get top brands
    const topBrands = await Product.aggregate([
      { $match: { deleted: { $ne: true } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, term: '$_id', type: { $literal: 'brand' } } }
    ]);
    
    // Get top categories
    const topCategories = await Product.aggregate([
      { $match: { deleted: { $ne: true } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 0, term: '$_id', type: { $literal: 'category' } } }
    ]);
    
    return [...topBrands, ...topCategories];
  } catch (err) {
    console.error('Error getting popular searches:', err);
    return [];
  }
}

// ============================================
// MAIN CONTROLLER FUNCTIONS
// ============================================

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    const limit = Number(req.query._limit || 12);
    const cursor = req.query.cursor || null;
    const sortField = req.query._sort || 'random';
    const sortOrder = req.query._order === 'asc' ? 1 : -1;
    
    const sessionId = generateSessionSeed(req);

    let condition = { deleted: { $ne: true } };

    // ===== ADMIN MODE =====
    if (req.query.admin) {
      condition = {};
    }

    // ===== FILTERS =====
    if (req.query.category) {
      condition.category = { $in: req.query.category.split(',') };
    }
    if (req.query.brand) {
      condition.brand = { $in: req.query.brand.split(',') };
    }

    // ===== SORTING LOGIC =====
    let products;
    let nextCursor = null;
    let hasMore = false;

    if (sortField === 'random' || sortField === 'feedScore' || !sortField) {
      // ===== RANDOM ORDER =====
      let allProducts = await Product.find(condition).lean();
      
      allProducts = allProducts.map(product => ({
        ...product,
        _sessionScore: getProductScore(product._id, sessionId)
      }));
      
      allProducts.sort((a, b) => b._sessionScore - a._sessionScore);
      
      if (cursor) {
        const [cursorScore, cursorId] = cursor.split(':');
        const cursorIndex = allProducts.findIndex(
          p => p._sessionScore === Number(cursorScore) && p._id.toString() === cursorId
        );
        
        if (cursorIndex !== -1) {
          allProducts = allProducts.slice(cursorIndex + 1);
        }
      }
      
      products = allProducts.slice(0, limit);
      hasMore = allProducts.length > limit;
      nextCursor = hasMore && products.length > 0
        ? `${products[products.length - 1]._sessionScore}:${products[products.length - 1]._id}`
        : null;
      
      products = products.map(p => {
        const { _sessionScore, ...product } = p;
        return product;
      });
      
    } else if (sortField === 'rating') {
      // ===== SORT BY RATING =====
      let sortCriteria = { rating: sortOrder, _id: 1 };
      let cursorCondition = {};
      
      if (cursor) {
        const [cursorRating, cursorId] = cursor.split(':');
        if (sortOrder === -1) {
          cursorCondition = {
            $or: [
              { rating: { $lt: Number(cursorRating) } },
              { rating: Number(cursorRating), _id: { $gt: cursorId } }
            ]
          };
        } else {
          cursorCondition = {
            $or: [
              { rating: { $gt: Number(cursorRating) } },
              { rating: Number(cursorRating), _id: { $gt: cursorId } }
            ]
          };
        }
      }
      
      if (Object.keys(cursorCondition).length > 0) {
        condition = { $and: [condition, cursorCondition] };
      }
      
      products = await Product.find(condition)
        .sort(sortCriteria)
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        const lastProduct = products[limit - 1];
        nextCursor = `${lastProduct.rating}:${lastProduct._id}`;
        products.pop();
      }
      
    } else if (sortField === 'discountPrice' || sortField === 'price') {
      // ===== SORT BY PRICE =====
      const priceField = sortField;
      let sortCriteria = { [priceField]: sortOrder, _id: 1 };
      let cursorCondition = {};
      
      if (cursor) {
        const [cursorPrice, cursorId] = cursor.split(':');
        if (sortOrder === -1) {
          cursorCondition = {
            $or: [
              { [priceField]: { $lt: Number(cursorPrice) } },
              { [priceField]: Number(cursorPrice), _id: { $gt: cursorId } }
            ]
          };
        } else {
          cursorCondition = {
            $or: [
              { [priceField]: { $gt: Number(cursorPrice) } },
              { [priceField]: Number(cursorPrice), _id: { $gt: cursorId } }
            ]
          };
        }
      }
      
      if (Object.keys(cursorCondition).length > 0) {
        condition = { $and: [condition, cursorCondition] };
      }
      
      products = await Product.find(condition)
        .sort(sortCriteria)
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        const lastProduct = products[limit - 1];
        nextCursor = `${lastProduct[priceField] || 0}:${lastProduct._id}`;
        products.pop();
      }
    }

    // ===== CALCULATE DISCOUNT PRICES =====
    const productsWithPrices = products.map(product => {
      if (!product.discountPrice && product.price && product.discountPercentage) {
        product.discountPrice = Math.round(
          product.price * (1 - product.discountPercentage / 100)
        );
      }
      return product;
    });

    res.status(200).json({
      products: productsWithPrices,
      nextCursor,
      hasMore,
      count: productsWithPrices.length,
      sessionId,
    });

  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(400).json({ 
      error: 'Failed to fetch products',
      message: err.message 
    });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ============================================
// 🔍 NEW: SEARCH ENDPOINTS
// ============================================

// Search products with full results (with pagination)
exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    const limit = Number(req.query._limit || 12);
    const cursor = req.query.cursor || null;
    const sortField = req.query._sort || 'relevance';
    const sortOrder = req.query._order === 'asc' ? 1 : -1;

    if (!searchTerm.trim()) {
      return res.status(400).json({ 
        error: 'Search term is required',
        products: [],
        suggestions: await getPopularSearches()
      });
    }

    let condition = buildSearchQuery(searchTerm, req.query.admin);

    // ===== FILTERS =====
    if (req.query.category) {
      condition.category = { $in: req.query.category.split(',') };
    }
    if (req.query.brand) {
      condition.brand = { $in: req.query.brand.split(',') };
    }

    let products;
    let nextCursor = null;
    let hasMore = false;

    if (sortField === 'relevance') {
      // ===== SORT BY RELEVANCE (TEXT SCORE) =====
      const projection = { score: { $meta: 'textScore' } };
      
      products = await Product.find(condition, projection)
        .sort({ score: { $meta: 'textScore' }, _id: 1 })
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        products.pop();
      }
      
      // For relevance, cursor-based pagination is complex, so we'll use offset
      // In production, consider using Elasticsearch for better search pagination
      
    } else if (sortField === 'rating') {
      // ===== SORT BY RATING =====
      let sortCriteria = { rating: sortOrder, _id: 1 };
      
      products = await Product.find(condition)
        .sort(sortCriteria)
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        const lastProduct = products[limit - 1];
        nextCursor = `${lastProduct.rating}:${lastProduct._id}`;
        products.pop();
      }
      
    } else if (sortField === 'discountPrice' || sortField === 'price') {
      // ===== SORT BY PRICE =====
      const priceField = sortField;
      let sortCriteria = { [priceField]: sortOrder, _id: 1 };
      
      products = await Product.find(condition)
        .sort(sortCriteria)
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        const lastProduct = products[limit - 1];
        nextCursor = `${lastProduct[priceField] || 0}:${lastProduct._id}`;
        products.pop();
      }
    } else {
      // Default sorting
      products = await Product.find(condition)
        .limit(limit + 1)
        .lean();
      
      if (products.length > limit) {
        hasMore = true;
        products.pop();
      }
    }

    // ===== CALCULATE DISCOUNT PRICES =====
    const productsWithPrices = products.map(product => {
      if (!product.discountPrice && product.price && product.discountPercentage) {
        product.discountPrice = Math.round(
          product.price * (1 - product.discountPercentage / 100)
        );
      }
      return product;
    });

    res.status(200).json({
      products: productsWithPrices,
      nextCursor,
      hasMore,
      count: productsWithPrices.length,
      searchTerm,
    });

  } catch (err) {
    console.error('Error searching products:', err);
    res.status(400).json({ 
      error: 'Search failed',
      message: err.message 
    });
  }
};

// Auto-suggest endpoint (fast, limited results)
exports.searchSuggestions = async (req, res) => {
  try {
    const searchTerm = req.query.q || '';
    const limit = Number(req.query.limit || 10);

    if (!searchTerm.trim()) {
      // Return popular searches when no term
      const popular = await getPopularSearches(limit);
      return res.status(200).json({
        suggestions: popular,
        searchTerm: '',
      });
    }

    // Build regex for partial matching
    const regex = new RegExp(searchTerm, 'i');
    
    // Get product title suggestions
    const productSuggestions = await Product.find({
      deleted: { $ne: true },
      $or: [
        { title: regex },
        { brand: regex },
        { category: regex },
      ]
    })
    .select('title brand category thumbnail _id')
    .limit(limit)
    .lean();

    // Get unique brands matching search
    const brandSuggestions = await Product.distinct('brand', {
      deleted: { $ne: true },
      brand: regex
    });

    // Get unique categories matching search
    const categorySuggestions = await Product.distinct('category', {
      deleted: { $ne: true },
      category: regex
    });

    // Format suggestions
    const suggestions = [
      ...brandSuggestions.slice(0, 3).map(brand => ({
        term: brand,
        type: 'brand',
        matchType: 'brand'
      })),
      ...categorySuggestions.slice(0, 3).map(category => ({
        term: category,
        type: 'category',
        matchType: 'category'
      })),
      ...productSuggestions.map(product => ({
        term: product.title,
        type: 'product',
        matchType: 'product',
        productId: product._id,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
      }))
    ];

    res.status(200).json({
      suggestions: suggestions.slice(0, limit),
      searchTerm,
    });

  } catch (err) {
    console.error('Error getting search suggestions:', err);
    res.status(400).json({ 
      error: 'Failed to get suggestions',
      message: err.message 
    });
  }
};

// Get popular/trending searches
exports.getPopularSearches = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 10);
    const popular = await getPopularSearches(limit);
    
    res.status(200).json({
      popular,
      count: popular.length,
    });
  } catch (err) {
    console.error('Error getting popular searches:', err);
    res.status(400).json({ 
      error: 'Failed to get popular searches',
      message: err.message 
    });
  }
};