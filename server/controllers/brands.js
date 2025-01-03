import Brand from "../models/brandModel.js";

export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Brand name is required.server error" });
    }
    const trimmedName = name.trim();
  
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return res.status(400).json({
        error: "Brand name must be between 3 and 30 characters.server error",
      });
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return res.status(400).json({
        error: "Brand name can only contain letters, numbers, spaces, and hyphens. server error",
      });
    }
    const existingBrand = await Brand.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });
    if (existingBrand) {
      return res.status(400).json({ error: "This Brand already exists." });
    }
    const brand = new Brand({ name: trimmedName });
    await brand.save();
    const selectedBrand = await Brand.findById(brand._id).select('name _id isDeleted');
    res.status(201).json(selectedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const brands = await Brand.find(
      includeDeleted ? {} : { isDeleted: false }
    ).select('-__v -createdAt -updatedAt');
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Brand name is required.server error" });
    }
    const trimmedName = name.trim();
  
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return res.status(400).json({
        error: "Brand name must be between 3 and 30 characters.server error",
      });
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return res.status(400).json({
        error: "Brand name can only contain letters, numbers, spaces, and hyphens. server error",
      });
    }
    const existingBrand = await Brand.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },_id: { $ne: id }
    });
    if (existingBrand) {
      return res.status(400).json({ error: "This Brand already exists. server error" });
    }
    
    const brand = await Brand.findByIdAndUpdate(id, { name: trimmedName }, { new: true }).select('-__v -createdAt -updatedAt');
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrRestoreBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      id,
      { isDeleted },
      { new: true }
    ).select('-__v -createdAt -updatedAt');

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const countBrands = async (req, res) => {
  try {
    const count = await Brand.countDocuments({ isDeleted: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};