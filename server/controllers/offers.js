import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

export const addOffer = async (req, res) => {
  try {
    const {
      offerName,
      offerDescription,
      offerType,
      offerValue,
      maximumDiscount,
      validFrom,
      validTill,
      isActive
    } = req.body;
    console.log(req.body);

    let errors = {};
    if (!offerName) errors.offerName = "Offer name is required";
    if (!offerType) errors.offerType = "Offer type is required";
    if (!offerValue) errors.offerValue = "Offer value is required";
    if (offerType === "percentage" && !maximumDiscount) errors.maximumDiscount = "Maximum discount is required";
    if (maximumDiscount < 0) errors.maximumDiscount = "Maximum discount must be a non-negative value";
    if (!validFrom) errors.validFrom = "Valid from date is required";
    if (!validTill) errors.validTill = "Valid till date is required";
    if (validFrom >= validTill) errors.validTill = "Valid till date must be after valid from date";
    if( offerType === "percentage" && (offerValue < 0 || offerValue > 60)) errors.offerValue = "Percentage value must be between 0 and 60";
    if( offerType === "fixed" && offerValue < 0) errors.offerValue = "Fixed value must be a non-negative value";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const existingOffer = await Offer.findOne({ offerName, isActive: true });
    if (existingOffer) {
      return res.status(400).json({ message: "Offer with this name already exists" });
    }

    const newOffer = new Offer({
      offerName,
      offerDescription,
      offerType,
      offerValue,
      maximumDiscount,
      validFrom: new Date(validFrom),
      validTill: new Date(validTill),
      isActive,
    });

    await newOffer.save();
    return res.status(201).json({ message: "Offer added successfully", offer: newOffer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add offer", error: error.message });
  }
};



export const getOffers = async (req, res) => {

  const { currentPage, limitPerPage, filter, sort, search } = req.query;
  try {
    const now = new Date();
    await Offer.updateMany({ validTill: { $lt: now }, isActive: true }, { isActive: false });

    const filters = {};
    if (filter && filter === 'active') {
      filters.isActive = true;
      filters.validFrom = { $lte: now };
    } else if (filter && filter === 'inactive') {
      filters.isActive = false;
    } else if (filter && filter === 'expired') {
      filters.validTill = { $lt: now };
    } else if (filter && filter === 'upcoming') {
      filters.validFrom = { $gt: now };
    } else if (filter && filter === 'percentage') {
      filters.offerType = 'percentage';
    } else if (filter && filter === 'fixed') {
      filters.offerType = 'fixed';
    }

    if (search) {
      filters.offerName = { $regex: search, $options: 'i' };
    }

    const sortQuery = {};
    if (sort && sort === 'ascending') {
      sortQuery.createdAt = 1;
    } else if (sort && sort === 'descending') {
      sortQuery.createdAt = -1;
    }

    const skip = (parseInt(currentPage) - 1) * parseInt(limitPerPage);
    const offers = await Offer.find(filters).sort(sortQuery).skip(skip).limit(parseInt(limitPerPage)).populate({
      path: 'products',
      select: 'name',
    }).populate({
      path: 'categories',
      select: 'name',
    });
    const totalOffers = await Offer.countDocuments(filters);
    const totalPages = Math.ceil(totalOffers / parseInt(limitPerPage));
    
    return res.status(200).json({ totalPages, offers });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get coupons", error: error.message });
    }
  }


  export const updateOffer = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        offerName,
        offerDescription,
        offerType,
        offerValue,
        maximumDiscount,
        validFrom,
        validTill,
        isActive
      } = req.body;
  
      let errors = {};
    if (!offerName) errors.offerName = "Offer name is required";
    if (!offerType) errors.offerType = "Offer type is required";
    if (!offerValue) errors.offerValue = "Offer value is required";
    if (offerType === "percentage" && !maximumDiscount) errors.maximumDiscount = "Maximum discount is required";
    if (maximumDiscount < 0) errors.maximumDiscount = "Maximum discount must be a non-negative value";
    if (!validFrom) errors.validFrom = "Valid from date is required";
    if (!validTill) errors.validTill = "Valid till date is required";
    if (validFrom >= validTill) errors.validTill = "Valid till date must be after valid from date";
    if( offerType === "percentage" && (offerValue < 0 || offerValue > 60)) errors.offerValue = "Percentage value must be between 0 and 60";
    if( offerType === "fixed" && offerValue < 0) errors.offerValue = "Fixed value must be a non-negative value";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
  
      const updatedOffer = await Offer.findByIdAndUpdate(id, {
        offerName,
        offerDescription,
        offerType,
        offerValue,
        maximumDiscount,
        validFrom: new Date(validFrom),
        validTill: new Date(validTill),
        isActive,
      }, { new: true });
      res.status(200).json({ message: "Offer updated successfully", offer: updatedOffer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update offer", error: error.message });
    }
  }
  

  export const deleteOrRestoreOffer = async (req, res) => {
    try {
      const { id } = req.params;
      const offer = await Offer.findById(id);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      const updatedOffer = await Offer.findByIdAndUpdate(id, { isDeleted: !offer.isDeleted }, { new: true });
      if (updatedOffer.isDeleted) {
        updatedOffer.isActive = false;
      } else {
        if (updatedOffer.validTill < new Date()) {
          updatedOffer.isActive = false;
        } else {
          updatedOffer.isActive = true;
        }
      }
      await updatedOffer.save();
      res.status(200).json({ message: `Offer ${updatedOffer.isDeleted ? 'deleted' : 'restored'} successfully`, offer: updatedOffer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update Offer", error: error.message });
    }
  }
  


  export const getCategoriesAndProductsList = async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: false }).select("name").sort({ name: 1 });
      const products = await Product.find({ islisted: true }).select("name").sort({ name: 1 });
      res.status(200).json({ categories, products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get categories and products list", error: error.message });
    }
  }


  export const applyOffer = async (req, res) => {
    const { offerId, products, categories } = req.body;
  
    try {
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
  
      if (products.length > 0) {
        offer.products = [...offer.products, ...products];
        offer.products = [...new Set(offer.products.map((product) => product._id.toString()))];
      }
  
      if (categories.length > 0) {
        offer.categories = [...offer.categories, ...categories];
        offer.categories = [...new Set(offer.categories.map((category) => category._id.toString()))];
      }
      
      await offer.save();
      // const updatedOffer = await Offer.findById(offerId).populate('products', 'name regularPrice discountedPrice').populate('categories', 'name');
      const { offerType, offerValue, maximumDiscount } = offer;
      // const updatedProducts = new Set();
      
      if(products.length > 0) {
        for (const productId of offer.products) {
          const product = await Product.findById(productId);
    
          if (product) {
            let newDiscountedPrice;
    
            if (offerType === "percentage") {
              let discount = (product.regularPrice * offerValue) / 100;
              if (maximumDiscount) {
                discount = Math.max(discount, maximumDiscount);
              }
              newDiscountedPrice = product.regularPrice - discount;
            } else if (offerType === "fixed") {
              newDiscountedPrice = product.regularPrice - offerValue;
              console.log(product.regularPrice - offerValue)
            }
    
            product.discountedPrice = Math.min(
              product.discountedPrice ?? Infinity, 
              Math.max(newDiscountedPrice, 0) 
            ); 
            await product.save();
          }
        }
      }

      if(categories.length >0){
        for (const categoryId of offer.categories) {
          const productsInCategory = await Product.find({ category: categoryId });
    
          for (const product of productsInCategory) {
            // if (updatedProducts.has(product._id.toString())) continue;
    
            let newDiscountedPrice;
    
            if (offerType === "percentage") {
              let discount = (product.regularPrice * offerValue) / 100;
              if (maximumDiscount) {
                discount = Math.min(discount, maximumDiscount);
              }
              newDiscountedPrice = product.regularPrice - discount;
            } else if (offerType === "fixed") {
              newDiscountedPrice = product.regularPrice - offerValue;
            }
    
            product.discountedPrice = Math.min(
              product.discountedPrice ?? Infinity,
              Math.max(newDiscountedPrice, 0)
            );
    
            await product.save();
            // updatedProducts.add(product);
          }
        }
      }
  
      const updatedOffer = await Offer.findById(offerId)
        .populate('products', 'name regularPrice discountedPrice')
        .populate('categories', 'name');
  
      res.status(200).json({
        message: "Offer and product prices updated successfully",
        offer: updatedOffer,
        // updatedProducts: Array.from(updatedProducts),
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Failed to update offer", error });
    }
  };



  export const removeOffer = async (req, res) => {
    const { offerId, products, categories } = req.body;
  
    try {
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
  
      if (products.length > 0) {
        offer.products = offer.products.filter(
          (product) => !products.includes(product.toString())
        );
  
        for (const productId of products) {
          const product = await Product.findById(productId);
  
          if (product && product.discountedPrice) {
            product.discountedPrice = product.regularPrice; 
            await product.save();
          }
        }
      }

      if (categories.length > 0) {
        offer.categories = offer.categories.filter(
          (category) => !categories.includes(category.toString())
        );
  
        for (const categoryId of categories) {
          const productsInCategory = await Product.find({ category: categoryId });
  
          for (const product of productsInCategory) {
            if (product.discountedPrice) {
              product.discountedPrice = product.regularPrice; 
              await product.save();
            }
          }
        }
      }
  
      await offer.save();
  
      const updatedOffer = await Offer.findById(offerId)
        .populate('products', 'name regularPrice discountedPrice')
        .populate('categories', 'name');
  
      res.status(200).json({
        message: "Offer removed successfully",
        offer: updatedOffer,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update offer", error });
    }
  };
  


  //                                User


  export const offerForBanner = async (req, res) => {
    try {
      const offers = await Offer.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(2)
        .populate("products", "images")
        .populate("categories", "name");
  
      if (!offers || offers.length === 0) {
        return res.status(404).json({ message: "No active offers found" });
      }
  
      const offerDetails = await Promise.all(
        offers.map(async (offer) => {
          let image = null;
          let offerValue = offer.offerValue;
  
          // Check if the offer has associated products
          if (offer.products && offer.products.length > 0) {
            const firstProduct = offer.products[0];
            image = firstProduct.images.length > 0 ? firstProduct.images[0].url : null;
          } else if (offer.categories && offer.categories.length > 0) {
            // If no products, fetch the first product of the first category
            const firstCategoryId = offer.categories[0]._id;
  
            const productInCategory = await Product.findOne({ category: firstCategoryId, islisted: true })
              .select("images")
              .sort({ createdAt: 1 });
  
            if (productInCategory && productInCategory.images.length > 0) {
              image = productInCategory.images[0].url;
            }
          }
  
          return {
            offerName: offer.offerName,
            offerDescription: offer.offerDescription,
            offerType: offer.offerType,
            offerValue,
            image,
          };
        })
      );
  
      return res.status(200).json(offerDetails);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ message: "Failed to fetch offers", error });
    }
  };