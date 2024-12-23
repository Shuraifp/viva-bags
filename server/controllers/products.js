import Product from "../models/productModel.js"; 
import Category from "../models/categoryModel.js";
import multer from "multer";
import path from "path";
import {__dirname} from "../index.js";
import mongoose from "mongoose";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    console.log(uploadPath);
    console.log(file);
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
})

export const upload = multer({ storage: storage });


export const createProduct =  async(req, res) => {
  const color = JSON.parse(req.body.color);
  
  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category, 
    brand: req.body.brand,
    regularPrice: Number(req.body.regularPrice),
    discountedPrice: Number(req.body.discountedPrice),
    stock: Number(req.body.stock) || 1,   
    color: {
      name: color.name, 
      hex: color.hex,
    },
    size: req.body.size ,
    images: req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    }))
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

  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category, 
    brand: req.body.brand,
    regularPrice: Number(req.body.regularPrice),
    discountedPrice: Number(req.body.discountedPrice),
    stock: Number(req.body.stock) || 1,   
    color: {
      name: color.name, 
      hex: color.hex,
    },
    size: req.body.size ,
    images: req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    }))
  };
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true }).select('-__v -createdAt -updatedAt');
    res.json({message: "product updated successfully"});
  } catch (error) {
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


//                         user side


export const getProductByIdForUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('invalid id')
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
    const { option, currentPage, limitPerPage } = req.query;
    if (!option) {
      return res.status(400).json({ message: "Sort option is required" });
  }

    let sortOption = {};
    switch (option) {
      case "popularity":
        sortOption.popularity = -1;
        break;
      case "price_low_high":
        sortOption.discountedPrice = 1;
        break;
      case "price_high_low":
        sortOption.discountedPrice = -1;
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
    const productsCount = await Product.countDocuments({ islisted: true, category: { $in: listedCategoryIds } });
    const totalPages = Math.ceil(productsCount / limitPerPage);
    const skip = (currentPage - 1) * limitPerPage;
    const products = await Product.find({ islisted: true, category: { $in: listedCategoryIds } }).sort(sortOption).skip(skip).limit(limitPerPage).select('-__v -createdAt -updatedAt').populate('category','name')
    res.status(200).json({ success: true, productsData: products, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}