import React, { useState, useEffect, useRef } from "react";
import { Link,useParams } from "react-router-dom";
import GeneralAttributes from "./GeneralAttributes";
import VariantAttributes from "./VariantAttributes";
import { fetchProductById, addProduct, updateProduct } from "../../../api/products";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getCategories } from "../../../api/category";
import { getBrands } from "../../../api/brand";
import { toast } from "react-hot-toast";

const AddProductPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(id || null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    regularPrice: "",
    discountedPrice: "",
    stock: "",
    color: { name: "", hex: "" },
    size: "",
    images: [],
  });
  const [images, setImages] = useState([]);
  const [errors , setErrors] = useState({})
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const convertToFile = async (img) => {
      const response = await fetch(import.meta.env.VITE_API_URL + img.url); 
      const blob = await response.blob(); 
      return new File([blob], img.filename, { type: blob.type }); 
    };
  
    const loadImages = async () => {
      if (isEditing && product.images.length > 0) {
        const updatedImages = await Promise.all(
          product.images.map(async (img) => ({
            file: await convertToFile(img), 
            preview: import.meta.env.VITE_API_URL + img.url, 
          }))
        );
        setImages(updatedImages); 
      }
    };
  
    loadImages(); 
  }, [product, isEditing]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories(false);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const brandData = await getBrands();
        setBrands(brandData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchCategories();
    fetchBrands();

    if(isEditing){
      fetchProductDetails();
    }
  }, []);

  const fetchProductDetails = async (id) => {
    try {
      const productData = await fetchProductById(id || isEditing);
      setProduct({...productData,category:productData.category._id});
      
    } catch (error) {
      toast.error("Error fetching product details:", error);
    }
  }

  const validateForm = () => {
    let isValid = true;
    setErrors({});
    const newErrors = {};
  
    if (!product.regularPrice || Number(product.regularPrice) <= 0) {
      newErrors["regularPrice"] = "Regular Price is required.";
      isValid = false;
    }
    
    if (!product.discountedPrice || Number(product.discountedPrice) <= 0) {
      newErrors["discountedPrice"] = "Discounted Price is required and must be greater than 0.";
      isValid = false;
    }
    
    if (Number(product.discountedPrice) >= Number(product.regularPrice)) {
      newErrors["discountedPrice"] = "Discounted Price must be less than regular price.";
      isValid = false;
    }
  
    if (!product.stock || product.stock <= 0) {
      newErrors['stock'] = "Stock is required and must be greater than 0.";
      isValid = false;
    }
  
    if (!product.size) {
      newErrors['size'] = "Size not selected.";
      isValid = false;
    }

    if (!(/^[a-zA-Z0-9\s'-]+$/.test(product.name.trim()))) {
      newErrors['productName'] = "Product name is required and should be valid.";
      isValid = false;
    }
    if (!(/^[a-zA-Z0-9\s',.-]+$/.test(product.description.trim()))) {
      newErrors['description'] = "Description is required and should be valid";
      isValid = false;
    }
    if (!product.category) {
      newErrors['category'] = "cateory not selected.";
      isValid = false;
    }
    if (!product.brand) {
      newErrors['brand'] = "brand not selected.";
      isValid = false;
    }
    if (!product.color.hex) {
      newErrors['colorhex'] = "color not choosed.";
      isValid = false;
    }
    if (!product.color.name) {
      newErrors['colorname'] = "Add color name.";
      isValid = false;
    }
    if (!images.length) {
      newErrors['images'] = "No images selected.";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    if(value && field !== 'name') setErrors({...errors, [field]: ""})
      else if(value && field === 'name') setErrors({...errors, productName: ""})
  };


  const handleSaveProduct = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("regularPrice", product.regularPrice);
    formData.append("discountedPrice", product.discountedPrice);
    formData.append("stock", product.stock);
    formData.append("color", JSON.stringify(product.color));
    formData.append("size", product.size);

    images.forEach((img, index) => {
      formData.append(`images`, img.file);
    });

    try {
      if (isEditing) {
        const response = await updateProduct(isEditing, formData);
        toast.success(response.data.message);
      } else {
        const response = await addProduct(formData);
        console.log(response)
        if (response.status === 201) {
          toast.success(response.data.message);
          setIsEditing(response.data.product._id);
          fetchProductDetails(response.data.product._id);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      // toast.error(error);
      console.log(error)
    }
  };
  {/*     add image and  image crop */}
  const inputRef = useRef(null);
  const cropperRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let error = 0;
    Array.from(files).forEach((file) => {
      if (!["image/jpeg", "image/png", "image/gif", "image/jpg", "image/avif"].includes(file.type)) {
        toast.error(`${file?.name}: Invalid file type. Only JPEG, PNG, and GIF are allowed.`);
        error++;
        return;
      } else if (file.size > 5*1024*1024) {
        toast.error(`${file?.name}: File size exceeds 5MB.`);
        error++;
        return;
      } else {
        toast.success('file selected successfully')
      }
    });
    if(error>0) return;
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    if(files.length) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.images;
        return updatedErrors;
      });
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const croppedImage = {
            file: blob,
            preview: URL.createObjectURL(blob),
          };
          setImages((prevImages) =>
            prevImages.map((img) =>
              img.preview === selectedImage ? croppedImage : img
            )
          );
          if(croppedImage) toast.success('image cropped successfully')
          setSelectedImage("");
        }
      });
    }
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
 
  return (
    <div className="max-h-[88vh] bg-gray-100 overflow-y-scroll p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl text-center mb-12 text-gray-600 font-bold">{isEditing ? "Edit Product" : "Add Product"}</h2>

        <div className="flex justify-end">
          <Link to="/admin/products">
            <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
              Back to Products
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
      <button
        onClick={() => inputRef.current.click()}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Upload Images
      </button>
      <input
        type="file"
        ref={inputRef}
        multiple
        hidden
        onChange={handleFileChange}
      />
      {errors.images && (
    <div className="text-red-500 text-sm">{errors.images}</div>
  )}
      <div className="flex flex-wrap gap-2 mt-4">
        {images?.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img.preview}
              alt={`Product ${index + 1}`}
              className="w-16 h-16 rounded border cursor-pointer"
              onClick={() => setSelectedImage(img.preview)}
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white px-1"
              onClick={() => handleRemoveImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="mt-4">
          <Cropper
            ref={cropperRef}
            src={selectedImage}
            style={{ width: "100%", height: "100%" }}
            aspectRatio={16 / 9}
          />
          <button onClick={handleCrop} className="bg-slate-600 text-white px-4 py-2 rounded mt-2">
            Crop
          </button>
          <button onClick={() => setSelectedImage("")} className="bg-slate-600 text-white px-4 py-2 rounded mt-2 ml-3">
            Cancel
          </button>
        </div>
      )}
    </div>
{/*...............................................................................................*/}
          <GeneralAttributes
            product={product}
            errors={errors}
            isEditing={isEditing}
            categories={categories}
            brands={brands}
            handleInputChange={handleInputChange}
          />

          <VariantAttributes 
          product={product} 
          handleInputChange={handleInputChange}
          errors={errors} />
        </div>
        <div className="flex justify-end">
          <button
              onClick={handleSaveProduct}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
            >
              Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
