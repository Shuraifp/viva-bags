import Product from "../models/productModel.js"; 
import Category from "../models/categoryModel.js";
import multer from "multer";
import path from "path";
import {__dirname} from "../index.js";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: 'dh7g6qjcj', 
  api_key: '388977869245964',       
  api_secret: '_zP2mZ1CaC6Z8MuOf7dq9JYSAro', 
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, 'uploads');
//     console.log(uploadPath);
//     console.log(file);
//     cb(null, uploadPath); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-"); 
//   },
// })

const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadResult = cloudinary.uploader.upload_stream(
      { folder: "vivaBags/products" }, 
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); 
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadResult);
  });
};


export const createProduct =  async(req, res) => {
  const color = JSON.parse(req.body.color);
  const variants = JSON.parse(req.body.variants)
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const imagePaths = [];
  for (const file of images) {
    const imageUrl = await uploadImageToCloudinary(file);
    imagePaths.push(imageUrl); 
  }

  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category, 
    brand: req.body.brand,
    regularPrice: Number(req.body.regularPrice),
    discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : req.body.regularPrice,
    variants: variants.map((variant) => ({
      size: variant.size, 
      stock: Number(variant.stock),
      additionalPrice: variant.additionalPrice
        ? Number(variant.additionalPrice)
        : 0,
    })),   
    color: {
      name: color.name, 
      hex: color.hex,
    },
    images: imagePaths.map((imageUrl) => ({ url: imageUrl,filename : '' })),
  };

  try {
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    if(error.code === 11000){
      res.status(400).json({ message: "Product already exists" });
    }else{
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export const updateProduct = async (req, res) => {
  const color = JSON.parse(req.body.color);
  const variants = JSON.parse(req.body.variants)

  const imagesToRemove = JSON.parse(req.body?.toRemove? req.body.toRemove : '[]');
  const product = await Product.findById(req.params.id);
  if(imagesToRemove && imagesToRemove.length > 0){
    imagesToRemove.forEach(rmImg => {
      product.images = product.images.filter(img => img.url !== rmImg)
    })
  }
  product.markModified('images');
  await product.save();
  const newImages = req.files;
  const imageUrls = [...product.images];

  if (newImages && newImages.length > 0) {
    for (const file of newImages) {
      const imageUrl = await uploadImageToCloudinary(file);
      imageUrls.push({ url: imageUrl, filename: '' });
    }
  }

  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category, 
    brand: req.body.brand,
    regularPrice: Number(req.body.regularPrice),
    discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : req.body.regularPrice,
    variants: variants.map((variant) => ({
      size: variant.size, 
      stock: Number(variant.stock), 
      additionalPrice: variant.additionalPrice
        ? Number(variant.additionalPrice)
        : 0, 
    })),
    color: {
      name: color.name, 
      hex: color.hex,
    },
    images : imageUrls.map((imageUrl) => ({ url: imageUrl.url,filename : '' }))
  };
  console.log('ok')
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true }).select('-__v -createdAt -updatedAt');
    res.json({message: "product updated successfully"});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error Updating product', error });
  }
};  

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('brand').select('-__v -createdAt -updatedAt');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.islisted = !product.islisted;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error changing product status', error });
  }
}


export const countProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments({ islisted: true });
    res.json({ count });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}


export const countSoldProducts = async (req, res) => {
  try {
    const countOfSoldProducts = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status": "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$products.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSold: 1, 
        },
      },
    ]);
    res.json({ count: countOfSoldProducts[0].totalSold});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}

//                         user side


export const getProductByIdForUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findOne({ _id: req.params.id,  islisted: true })
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'category',
        select: 'name isDeleted',
        match: { isDeleted: false }, 
      });

      if (!product || !product.category) {
        return res.status(404).json({ message: 'Product not found or category is deleted' });
      }
      res.json(product);
    } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching product', error });
  }
};


export const getFilteredProducts = async (req, res) => {
  const { category } = req.params; 
  try {
    const filters = {};

    if (category) {
      filters.category = category;
      filters.islisted = true;
    }

    const products = await Product.find(filters).populate('category').select('-__v -createdAt -updatedAt -islisted');
    res.status(200).json({message: "Products fetched successfully", products});
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


export const getSortedProducts = async (req, res) => {
  try {
    const { option, currentPage, limitPerPage,searchQuery ,category, filterOptions} = req.query;
    if (!option) {
      return res.status(400).json({ message: "Sort option is required" });
  }

    const filters = {islisted: true};
    if (searchQuery) {
      filters.name = { $regex: searchQuery, $options: 'i' };
    }
    if(filterOptions){
      if(filterOptions.price && !filterOptions.price.includes("all")){
        filterOptions.price.includes("1000-10000") ? 
        filterOptions.price.includes('10000-40000') ? filters.finalPrice = { $gte: 1000, $lte: 40000 } : filters.finalPrice = { $gte: 1000, $lte: 10000 }
        : filters.finalPrice = { $gte: 10000, $lte: 40000 }
      }
      if(filterOptions.color && !filterOptions.color.includes("all")){
        filters["color.name"] = { $in: filterOptions.color }
      }
      if(filterOptions.size && !filterOptions.size.includes("all")){
        filters["variants.size"] = { $in: filterOptions.size }
      }
    }
  
    let sortOption = {};
    switch (option) {
      case "popularity":
        sortOption.popularity = -1;
        break;
      case "price_low_high":
        sortOption.finalPrice = 1;
        break;
      case "price_high_low":
        sortOption.finalPrice = -1;
        break;
      case "average_rating":
        sortOption.rating = -1;
        break;
      case "latest":
        sortOption.createdAt = -1;
        break;
      case "a_to_z":
        sortOption.name = 1;
        break;
      case "z_to_a":
        sortOption.name = -1;
        break;
      default:
        sortOption.createdAt = 1; 
    }
    
    const listedCategories = await Category.find({ isDeleted: false }).select('_id');
    const listedCategoryIds = listedCategories.map(category => category._id);
    const filteredCategory = listedCategories.find(cat => cat._id.toString() === category);
    filters.category = { $in: category ? [filteredCategory._id] : listedCategoryIds };

    const skip = (currentPage - 1) * limitPerPage;

    const pipeline = [
      {
        $addFields: {
          finalPrice: {
            $cond: {
              if: { $eq: ["$discountedPrice", 0] },
              then: "$regularPrice",
              else: "$discountedPrice",
            }
          }
        }
      },
      {
        $match: filters
      },
      {
        $sort: sortOption
      },
      {
        $skip: skip,
      },
      {
        $limit: parseInt(limitPerPage),
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]

    const products = await Product.aggregate(pipeline);
  
    const productsCount = await Product.countDocuments(filters);
    const totalPages = Math.ceil(productsCount / limitPerPage);

    
    res.status(200).json({ success: true, productsData: products, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).populate('category').select('-__v -createdAt -updatedAt -islisted');
    res.status(200).json({message: "Products fetched successfully", products});
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};



export const getFilterCounts = async (req, res) => {
  try {
    const priceCounts = await Promise.all([
      Product.countDocuments({ islisted: true }),
      Product.countDocuments({ islisted: true, discountedPrice: { $gte: 1000, $lte: 10000 } }),
      Product.countDocuments({ islisted: true, discountedPrice: { $gte: 10000, $lte: 40000 } }),
    ]);

    const colorCounts = await Product.aggregate([
      { $match: { islisted: true } },
      { $group: { _id: "$color.name", count: { $sum: 1 } } },
    ]);

    const sizeCounts = await Product.aggregate([
      { $match: { islisted: true } },
      { $unwind: "$variants" },
      { $group: { _id: "$variants.size", count: { $sum: 1 } } },
    ]);

    const response = {
      priceCounts: {
        all: priceCounts[0],
        "1000-10000": priceCounts[1],
        "10000-40000": priceCounts[2],
      },
      colorCounts: colorCounts.map((color) => ({
        color: color._id,
        count: color.count,
      })),
      sizeCounts: sizeCounts.map((size) => ({
        size: size._id,
        count: size.count,
      })),
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching filter counts:", error);
    res.status(500).json({ message: "Error fetching filter counts", error });
  }
};