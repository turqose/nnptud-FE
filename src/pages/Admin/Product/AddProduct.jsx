"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import { getCategoryProducts } from "../../../features/categoryProduct/categoryProductSlice";
import {
  addProduct,
  fetchProductById,
  updateProduct,
} from "../../../features/product/productSlice";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { categoryProducts } = useSelector((state) => state.categoryProducts);

  // Fetch product data if editing
  useEffect(() => {
    dispatch(
      getCategoryProducts({
        page: 1,
        limit: 100,
      })
    );
    if (id) {
      dispatch(fetchProductById(id)).then((response) => {
        const product = response.payload.product;
        for (const [key, value] of Object.entries(product)) {
          if (key === "expiryDate" || key === "manufacturingDate") {
            setValue(key, value.split("T")[0]);
          } else {
            setValue(key, value);
          }
        }
        console.log(product.images);
        setValue("category_id", product.categories[0].category_id);
        setImages(product.images || []);
      });
    }
  }, [dispatch, id, setValue]);

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    setImageError(false);
  };

  // Remove an image
  const removeImage = (url) => {
    setImages(images.filter((image) => image !== url));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (images.length === 0) {
      setImageError(true);
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Separate existing and new images
    const existingImages = images.filter((image) => image.image_id);
    const newImages = images.filter((image) => !image.image_id);

    existingImages.forEach((file) => {
      formData.append("existingImages", file.image_id);
    });

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (id) {
        await dispatch(updateProduct({ id, formData })).unwrap();
        navigate("/admin/product-list");

        toast.success("Product updated successfully");
      } else {
        await dispatch(addProduct(formData)).unwrap();
        navigate("/admin/product-list");

        toast.success("Product added successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save product");
    }
  };

  // Auto-generate slug from product name
  const productName = watch("name");
  useEffect(() => {
    if (productName) {
      setValue("slug", slugify(productName, { lower: true }));
    }
  }, [productName, setValue]);

  // Render form fields
  const renderFormField = (
    label,
    name,
    type = "text",
    placeholder,
    required = true,
    options = []
  ) => {
    return (
      <div>
        <label className="block text-sm mb-2">{label}</label>
        {type === "textarea" ? (
          <textarea
            placeholder={placeholder}
            rows={4}
            {...register(name, {
              required: required && `${label} is required`,
            })}
            className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        ) : type === "select" ? (
          <select
            {...register(name, {
              required: required && `${label} is required`,
            })}
            className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            {...register(name, {
              required: required && `${label} is required`,
            })}
            className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        )}
        {errors[name] && (
          <p className="text-red-500 text-sm">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl text-gray-800 dark:text-gray-200 mb-2">
              {id ? "Edit Product" : "Add Product"}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-indigo-500 hover:text-indigo-400">
                Dashboard
              </Link>
              <span className="text-gray-600 dark:text-gray-400">&gt;</span>
              <Link
                to="/admin/product-list"
                className="text-indigo-500 hover:text-indigo-400"
              >
                Product List
              </Link>
              <span className="text-gray-600 dark:text-gray-400">&gt;</span>
              <span className="text-gray-800 dark:text-gray-200">
                {id ? "Edit Product" : "Add Product"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
              type="button"
              onClick={() => window.history.back()}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm hover:bg-indigo-700 flex items-center gap-2"
              type="submit"
            >
              {id ? "Update Product" : "+ Add Product"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">General Information</h2>
              <div className="space-y-4">
                {renderFormField(
                  "Product Name",
                  "name",
                  "text",
                  "Type product name here..."
                )}
                {renderFormField(
                  "Slug",
                  "slug",
                  "text",
                  "Type product slug here..."
                )}
                {renderFormField(
                  "Description",
                  "description",
                  "textarea",
                  "Type product description here..."
                )}
                {renderFormField(
                  "Brand",
                  "brand",
                  "text",
                  "Type brand here..."
                )}
                {renderFormField(
                  "Origin",
                  "origin",
                  "text",
                  "Type origin here..."
                )}
              </div>
            </div>

            {/* Media */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Media</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-400"
                    >
                      Add Images
                    </label>
                    {imageError && (
                      <p className="text-red-500 text-sm">
                        At least one image is required
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-4">
                      {images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              typeof url.url === "string"
                                ? `${import.meta.env.VITE_API_URL}/${url.url}`
                                : URL.createObjectURL(url)
                            }
                            alt={`Preview ${index}`}
                            crossOrigin="anonymous"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <button
                          type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">
                Additional Information
              </h2>
              <div className="space-y-4">
                {renderFormField(
                  "Ingredients",
                  "ingredients",
                  "textarea",
                  "Type ingredients here..."
                )}
                {renderFormField(
                  "Adverse Effects",
                  "adverseeffect",
                  "textarea",
                  "Type adverse effects here..."
                )}
                {renderFormField(
                  "Dosage",
                  "dosage",
                  "textarea",
                  "Type dosage here..."
                )}
                {renderFormField(
                  "Usage",
                  "usage",
                  "textarea",
                  "Type usage here..."
                )}
                {renderFormField(
                  "Careful",
                  "careful",
                  "textarea",
                  "Type careful here..."
                )}
                {renderFormField(
                  "Preservation",
                  "preservation",
                  "textarea",
                  "Type preservation here..."
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Category</h2>
              <div className="space-y-4">
                {renderFormField(
                  "Product Category",
                  "category_id",
                  "select",
                  "",
                  true,
                  categoryProducts.map((category) => ({
                    value: category.category_id ?? category.name,
                    label: category.name,
                  }))
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Pricing</h2>
              <div className="space-y-4">
                {renderFormField(
                  "Base Price",
                  "price",
                  "number",
                  "Type base price here..."
                )}
                {renderFormField(
                  "Discount Percentage (%)",
                  "discount",
                  "number",
                  "Type discount percentage..."
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Inventory</h2>
              <div className="space-y-4">
                {renderFormField(
                  "SKU",
                  "sku",
                  "text",
                  "Type product SKU here..."
                )}
                {renderFormField(
                  "Quantity",
                  "inventory",
                  "number",
                  "Type product quantity here..."
                )}
              </div>
            </div>

            {/* Date */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Date</h2>
              <div className="space-y-4">
                {renderFormField("Expiry Date", "expiryDate", "date")}
                {renderFormField(
                  "Manufacturing Date",
                  "manufacturingDate",
                  "date"
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddProduct;
