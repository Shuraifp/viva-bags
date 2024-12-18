import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Category name is required.server error" });
    }
    const trimmedName = name.trim();
  
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return res.status(400).json({
        error: "Category name must be between 3 and 30 characters.server error",
      });
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return res.status(400).json({
        error: "Category name can only contain letters, numbers, spaces, and hyphens. server error",
      });
    }
    const existingCategory = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });
    if (existingCategory) {
      return res.status(400).json({ error: "This category already exists." });
    }
    const category = new Category({ name: trimmedName });
    await category.save();
    const selectedCategory = await Category.findById(category._id).select('name _id isDeleted');
    res.status(201).json(selectedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const categories = await Category.find(
      includeDeleted ? {} : { isDeleted: false }
    ).select('-__v -createdAt -updatedAt');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Category name is required.server error" });
    }
    const trimmedName = name.trim();
  
    if (trimmedName.length < 3 || trimmedName.length > 30) {
      return res.status(400).json({
        error: "Category name must be between 3 and 30 characters.server error",
      });
    }
    const regex = /^[a-zA-Z0-9\s-]+$/;
    if (!regex.test(trimmedName)) {
      return res.status(400).json({
        error: "Category name can only contain letters, numbers, spaces, and hyphens. server error",
      });
    }
    const existingCategory = await Category.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },_id: { $ne: id }
    });
    if (existingCategory) {
      return res.status(400).json({ error: "This category already exists. server error" });
    }
    
    const category = await Category.findByIdAndUpdate(id, { name: trimmedName }, { new: true }).select('-__v -createdAt -updatedAt');
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrRestoreCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { isDeleted },
      { new: true }
    ).select('-__v -createdAt -updatedAt');

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
