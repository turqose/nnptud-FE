import { PlusIcon, XIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import GlobalLoading from "../../../components/GlobalLoading/GlobalLoading";
import { addCategoryBlog, fetchCategoryBlogById, updateCategoryBlog } from "../../../features/categoryBlog/categoryBlogSlice";


const AddPostCategory = () => {
   const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchCategoryBlogById(id)).then((response) => {
        const category = response.payload;
        console.log("category", category);
        for (const [key, value] of Object.entries(category)) {
          setValue(key, value);
        }
        setLoading(false);
      }).catch((error) => {
        toast.error(error.message ?? error.error);
        console.error("Failed to fetch category: ", error);
        setLoading(false);
      });
    }
  }, [id, dispatch, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await dispatch(updateCategoryBlog({ id, ...data })).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(addCategoryBlog(data)).unwrap();
        toast.success("Category added successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error(error.message ?? error.error);
      console.error("Failed to save category: ", error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      {loading && (<GlobalLoading />)}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{id ? "Edit Category" : "Add New Category"}</h2>
        <div className="flex gap-2">
          <Link
            to="/admin/post-category-list"
            className="bg-gray-700 px-4 text-white py-2 rounded-lg flex items-center gap-2"
          >
            <XIcon size={16} /> Cancel
          </Link>
          <button
            type="submit"
            className="bg-indigo-600 px-4 text-white py-2 rounded-lg flex items-center gap-2"
            onClick={handleSubmit(onSubmit)}
          >
            <PlusIcon size={16} /> {id ? "Update Category" : "Add Category"}
          </button>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
        <h3 className="text-lg font-semibold">General Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label className="block mt-4">
            <span className="text-sm text-gray-400">Category Name</span>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Type category name here..."
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </label>
          <label className="block mt-4">
            <span className="text-sm text-gray-400">Description</span>
            <textarea
              className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Type category description here..."
              {...register("description", { required: true })}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </label>
        </form>
      </div>
    </div>
  );
}

export default AddPostCategory;
