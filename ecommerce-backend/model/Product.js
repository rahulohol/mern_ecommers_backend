// // // const mongoose = require('mongoose');
// // // const {Schema} = mongoose;


// // // const productSchema = new Schema({
// // //     title: { type : String, required: true, unique: true},
// // //     description: { type : String, required: true},
// // //     price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
// // //     discountPercentage: { type: Number, min:[1, 'wrong min discount'], max:[99, 'wrong max discount']},
// // //     rating: { type: Number, min:[0, 'wrong min rating'], max:[5, 'wrong max price'], default:0},
// // //     stock: { type: Number, min:[0, 'wrong min stock'], default:0},
// // //     brand: { type : String, required: true},
// // //     category: { type : String, required: true},
// // //     thumbnail: { type : String, required: true},
// // //     images:{ type : [String], required: true},
// // //     colors:{ type : [Schema.Types.Mixed] },
// // //     sizes:{ type : [Schema.Types.Mixed]},
// // //     highlights:{ type : [String] },
// // //     discountPrice: { type: Number},
// // //     deleted: { type : Boolean, default: false},
// // // })

// // // const virtualId  = productSchema.virtual('id');
// // // virtualId.get(function(){
// // //     return this._id;
// // // })
// // // // we can't sort using the virtual fields. better to make this field at time of doc creation
// // // // const virtualDiscountPrice =  productSchema.virtual('discountPrice');
// // // // virtualDiscountPrice.get(function(){
// // // //     return Math.round(this.price*(1-this.discountPercentage/100));
// // // // })
// // // productSchema.set('toJSON',{
// // //     virtuals: true,
// // //     versionKey: false,
// // //     transform: function (doc,ret) { delete ret._id}
// // // })


// // // exports.Product = mongoose.model('Product',productSchema)



// // const mongoose = require('mongoose');
// // const { Schema } = mongoose;

// // const productSchema = new Schema(
// //   {
// //     title: { type: String, required: true, unique: true },
// //     description: { type: String, required: true },
// //     price: { type: Number, min: 1, max: 10000 },
// //     discountPercentage: { type: Number, min: 1, max: 99 },
// //     rating: { type: Number, min: 0, max: 5, default: 0 },
// //     stock: { type: Number, min: 0, default: 0 },
// //     brand: { type: String, required: true },
// //     category: { type: String, required: true },
// //     thumbnail: { type: String, required: true },
// //     images: { type: [String], required: true },
// //     colors: { type: [Schema.Types.Mixed] },
// //     sizes: { type: [Schema.Types.Mixed] },
// //     highlights: { type: [String] },
// //     discountPrice: { type: Number },
// //     deleted: { type: Boolean, default: false },

// //     // 🔥 Required for infinite scroll
// //     feedScore: {
// //       type: Number,
// //       index: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // // 🔥 Indexes (VERY IMPORTANT)
// // productSchema.index({ feedScore: -1, _id: 1 });
// // productSchema.index({ category: 1 });
// // productSchema.index({ brand: 1 });
// // productSchema.index({ deleted: 1 });

// // // Virtual ID
// // productSchema.virtual('id').get(function () {
// //   return this._id;
// // });

// // // JSON transform
// // productSchema.set('toJSON', {
// //   virtuals: true,
// //   versionKey: false,
// //   transform: function (doc, ret) {
// //     delete ret._id;
// //   },
// // });

// // // Auto-generate feedScore
// // productSchema.pre("save", function (next) {
// //   if (this.isNew && !this.feedScore) {
// //     this.feedScore = Date.now();
// //   }
// //   next();
// // });

// // exports.Product = mongoose.model('Product', productSchema);




// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const productSchema = new Schema(
//   {
//     title: { type: String, required: true, unique: true },
//     description: { type: String, required: true },
//     price: { type: Number, min: 1, max: 10000 },
//     discountPercentage: { type: Number, min: 1, max: 99 },
//     rating: { type: Number, min: 0, max: 5, default: 0 },
//     stock: { type: Number, min: 0, default: 0 },
//     brand: { type: String, required: true },
//     category: { type: String, required: true },
//     thumbnail: { type: String, required: true },
//     images: { type: [String], required: true },
//     colors: { type: [Schema.Types.Mixed] },
//     sizes: { type: [Schema.Types.Mixed] },
//     highlights: { type: [String] },
//     discountPrice: { type: Number },
//     deleted: { type: Boolean, default: false },

//     // 🔥 CRITICAL for infinite scroll - consistent ordering
//     feedScore: {
//       type: Number,
//       index: true,
//       default: () => Date.now() + Math.floor(Math.random() * 10000),
//     },
//   },
//   { timestamps: true }
// );

// // ===== INDEXES (CRITICAL FOR PERFORMANCE) =====
// // Compound index for default feed
// productSchema.index({ feedScore: -1, _id: 1 });

// // Compound indexes for sorting
// productSchema.index({ rating: -1, _id: 1 });
// productSchema.index({ discountPrice: -1, _id: 1 });
// productSchema.index({ price: -1, _id: 1 });
// productSchema.index({ discountPrice: 1, _id: 1 });
// productSchema.index({ price: 1, _id: 1 });

// // Filter indexes
// productSchema.index({ category: 1, feedScore: -1 });
// productSchema.index({ brand: 1, feedScore: -1 });
// productSchema.index({ deleted: 1, feedScore: -1 });

// // Combined filter + sort indexes for best performance
// productSchema.index({ category: 1, rating: -1, _id: 1 });
// productSchema.index({ brand: 1, rating: -1, _id: 1 });
// productSchema.index({ category: 1, discountPrice: -1, _id: 1 });
// productSchema.index({ brand: 1, discountPrice: -1, _id: 1 });

// // Virtual ID
// productSchema.virtual('id').get(function () {
//   return this._id;
// });

// // JSON transform
// productSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

// // ===== AUTO-GENERATE FEED SCORE =====
// productSchema.pre('save', function (next) {
//   if (this.isNew && !this.feedScore) {
//     // Create a unique but stable score for this product
//     // Combines timestamp with a hash of the product ID for consistency
//     const idHash = this._id.toString().split('').reduce(
//       (acc, char) => acc + char.charCodeAt(0),
//       0
//     );
//     this.feedScore = Date.now() + (idHash % 10000);
//   }
//   next();
// });

// // ===== STATIC METHODS =====

// // Method to shuffle feed scores (admin use only)
// productSchema.statics.shuffleFeedScores = async function () {
//   const products = await this.find({});
//   const updates = products.map(product => {
//     const newScore = Date.now() + Math.floor(Math.random() * 100000);
//     return this.updateOne(
//       { _id: product._id },
//       { $set: { feedScore: newScore } }
//     );
//   });
//   await Promise.all(updates);
//   return { updated: products.length };
// };

// // Method to reindex products
// productSchema.statics.reindexProducts = async function () {
//   await this.syncIndexes();
//   return { message: 'Indexes synchronized' };
// };

// exports.Product = mongoose.model('Product', productSchema);



const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, min: 1, max: 10000 },
    discountPercentage: { type: Number, min: 1, max: 99 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [Schema.Types.Mixed] },
    sizes: { type: [Schema.Types.Mixed] },
    highlights: { type: [String] },
    discountPrice: { type: Number },
    deleted: { type: Boolean, default: false },

    // For infinite scroll - consistent ordering
    feedScore: {
      type: Number,
      index: true,
      default: () => Date.now() + Math.floor(Math.random() * 10000),
    },

    // 🔍 NEW: For search optimization
    searchKeywords: { type: [String], index: true },
  },
  { timestamps: true }
);

// ===== TEXT SEARCH INDEX (CRITICAL FOR SEARCH) =====
productSchema.index({ 
  title: 'text', 
  description: 'text', 
  brand: 'text', 
  category: 'text',
  searchKeywords: 'text'
}, {
  weights: {
    title: 10,
    brand: 8,
    category: 6,
    searchKeywords: 5,
    description: 3,
  },
  name: 'product_text_index'
});

// ===== EXISTING INDEXES =====
// Compound index for default feed
productSchema.index({ feedScore: -1, _id: 1 });

// Compound indexes for sorting
productSchema.index({ rating: -1, _id: 1 });
productSchema.index({ discountPrice: -1, _id: 1 });
productSchema.index({ price: -1, _id: 1 });
productSchema.index({ discountPrice: 1, _id: 1 });
productSchema.index({ price: 1, _id: 1 });

// Filter indexes
productSchema.index({ category: 1, feedScore: -1 });
productSchema.index({ brand: 1, feedScore: -1 });
productSchema.index({ deleted: 1, feedScore: -1 });

// Combined filter + sort indexes for best performance
productSchema.index({ category: 1, rating: -1, _id: 1 });
productSchema.index({ brand: 1, rating: -1, _id: 1 });
productSchema.index({ category: 1, discountPrice: -1, _id: 1 });
productSchema.index({ brand: 1, discountPrice: -1, _id: 1 });

// Virtual ID
productSchema.virtual('id').get(function () {
  return this._id;
});

// JSON transform
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===== AUTO-GENERATE FEED SCORE =====
productSchema.pre('save', function (next) {
  if (this.isNew && !this.feedScore) {
    const idHash = this._id.toString().split('').reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    this.feedScore = Date.now() + (idHash % 10000);
  }
  next();
});

// ===== AUTO-GENERATE SEARCH KEYWORDS =====
productSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isModified('brand') || this.isModified('category')) {
    const keywords = new Set();
    
    // Add words from title
    const titleWords = this.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Add brand
    keywords.add(this.brand.toLowerCase());
    
    // Add category
    keywords.add(this.category.toLowerCase());
    
    // Add partial matches for autocomplete
    this.title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3) {
        for (let i = 3; i <= word.length; i++) {
          keywords.add(word.substring(0, i));
        }
      }
    });
    
    this.searchKeywords = Array.from(keywords);
  }
  next();
});

// ===== STATIC METHODS =====

// Method to shuffle feed scores (admin use only)
productSchema.statics.shuffleFeedScores = async function () {
  const products = await this.find({});
  const updates = products.map(product => {
    const newScore = Date.now() + Math.floor(Math.random() * 100000);
    return this.updateOne(
      { _id: product._id },
      { $set: { feedScore: newScore } }
    );
  });
  await Promise.all(updates);
  return { updated: products.length };
};

// Method to reindex products
productSchema.statics.reindexProducts = async function () {
  await this.syncIndexes();
  return { message: 'Indexes synchronized' };
};

exports.Product = mongoose.model('Product', productSchema);