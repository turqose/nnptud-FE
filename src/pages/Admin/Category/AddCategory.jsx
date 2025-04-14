import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import slugify from "slugify";
import GlobalLoading from "../../../components/GlobalLoading/GlobalLoading";
import {
  addCategoryProduct,
  fetchCategoryProductById,
  updateCategoryProduct,
} from "../../../features/categoryProduct/categoryProductSlice";

const AddCategory = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const generateSlug = (name) => {
    return slugify(name, {
      lower: true,
      strict: true,
    });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchCategoryProductById(id)).then((response) => {
        const category = response.payload;
        for (const [key, value] of Object.entries(category)) {
          setValue(key, value);
        }
        setCategoryData({
          name: category.name,
          slug: category.slug,
          image: category.image,
        });
        setLoading(false);
      });
    }
  }, [id, dispatch, setValue]);

  const handleImageUpload = (event) => {
    event.preventDefault(); // Prevent form submission
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setCategoryData((prevData) => ({
          ...prevData,
          image: file,
        }));
        setError("");
      } else {
        setError("Please upload a valid image file."); 
      }
    }
  };

  const handleAddImageClick = (event) => {
    event.preventDefault(); // Prevent form submission
    document.querySelector('input[type="file"]').click();
  };

  const handleRemoveImage = () => {
    setCategoryData((prevData) => ({
      ...prevData,
      image: null,
    }));
    setError("");
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    setValue("name", name);
    setCategoryData((prevData) => ({
      ...prevData,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSlugChange = (event) => {
    const slug = event.target.value;
    setCategoryData((prevData) => ({
      ...prevData,
      slug,
    }));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { name, slug, image } = categoryData;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      if (image) {
        formData.append("image", image);
      }

      if (id) {
        await dispatch(updateCategoryProduct({ id, formData })).unwrap();
        toast.success("Category updated successfully");
        navigate(-1);
      } else {
        await dispatch(addCategoryProduct(formData)).unwrap();
        toast.success("Category added successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to save category: ", error);
      toast.error(error.message ?? error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      {loading && <GlobalLoading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {id ? "Edit Category" : "Add Category"}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gray-700 px-4  text-white py-2 rounded-lg flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <XIcon size={16} /> Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 px-4 text-white py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon size={16} /> {id ? "Update Category" : "Add Category"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-semibold">Thumbnail</h3>
            <p className="text-sm text-gray-400">Photo</p>
            <label className="border-dashed border-2 flex flex-col items-center justify-center  rounded-lg cursor-pointer border-gray-400 dark:border-gray-600">
              {categoryData.image ? (
                <div className="relative h-full w-full">
                  <img
                    src={
                      categoryData.image instanceof File
                        ? URL.createObjectURL(categoryData.image)
                        : `${import.meta.env.VITE_API_URL}/${
                            categoryData.image
                          }`
                    }
                    alt="Preview"
                    crossOrigin="anonymous"
                    className="w-full object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p>Drag and drop image here, or click add image</p>
                  <button
                    type="button"
                    className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleAddImageClick}
                  >
                    Add Image
                  </button>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="md:col-span-2 p-4 rounded-lg bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-semibold">General Information</h3>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Category Name</span>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Type category name here..."
                {...register("name", {
                  required: "Category name is required",
                })}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name.message}
                </p>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Slug</span>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={categoryData.slug}
                onChange={handleSlugChange}
                placeholder="Type category slug here..."
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddCategory;
