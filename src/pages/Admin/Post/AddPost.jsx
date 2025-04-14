import { Editor } from "@tinymce/tinymce-react";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GlobalLoading from "../../../components/GlobalLoading/GlobalLoading";
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from "../../../features/blogs/blogSlice";
import { getCategoryBlogs } from "../../../features/categoryBlog/categoryBlogSlice";

const AddPost = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { categoryBlogs } = useSelector((state) => state.blogCategories);

  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    setValue("content", content);
  };
  useEffect(() => {
    dispatch(getCategoryBlogs({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      dispatch(fetchBlogById(id))
        .then((response) => {
          const blog = response.payload;
          for (const [key, value] of Object.entries(blog)) {
            setValue(key, value);
          }
          setTags(JSON.parse(blog.tags || "[]"));
          setImage(blog.image);
          setValue("categoryId", blog.category_id); // Set the selected category

          // Check if the editor is initialized before setting its content
          if (editorRef.current) {
            editorRef.current.setContent(blog.content); // Set the content of the editor
          } else {
            const interval = setInterval(() => {
              if (editorRef.current) {
                editorRef.current.setContent(blog.content);
                clearInterval(interval);
              }
            }, 100);
          }
        })
        .catch((error) => {
          toast.error(
            "Failed to fetch post: " + (error.message || error.error)
          );
          console.error("Failed to fetch post: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // Handle the mutation event
        }
      }
    });

    const targetNode = document.querySelector("#targetElement"); // Replace with your target element
    if (targetNode) {
      observer.observe(targetNode, { childList: true });
    }

    return () => {
      if (targetNode) {
        observer.disconnect();
      }
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setError("");
      } else {
        setError("Please upload a valid image file.");
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setError("");
  };

  const handleAddTag = (event) => {
    event.preventDefault(); // Prevent form submission
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    if (!image) {
      setError("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content); // Get content from the editor
    formData.append("category_id", data.categoryId);
    formData.append("status", data.status);
    formData.append("tags", JSON.stringify(tags));
    formData.append("image", image);

    try {
      if (id) {
        await dispatch(updateBlog({ id, formData })).unwrap();
        toast.success("Post updated successfully");
      } else {
        await dispatch(addBlog(formData)).unwrap();
        toast.success("Post added successfully");
        reset();
      }
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post: " + (error.message || error.error));
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      {loading && (<GlobalLoading />)}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {id ? "Edit Post" : "Add Post"}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gray-700 px-4 text-white py-2 rounded-lg flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <XIcon size={16} /> Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 px-4 text-white py-2 rounded-lg flex items-center gap-2"
            >
              <PlusIcon size={16} /> {id ? "Update Post" : "Add Post"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-semibold">Thumbnail</h3>
            <p className="text-sm text-gray-400">Photo</p>
            <label className="border-dashed border-2 flex flex-col items-center justify-center rounded-lg cursor-pointer border-gray-400 dark:border-gray-600">
              {image ? (
                <div className="relative h-full w-full">
                  <img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : `${import.meta.env.VITE_API_URL}/${image}`
                    }
                    alt="Preview"
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
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
                    onClick={() =>
                      document.querySelector('input[type="file"]').click()
                    }
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
              <span className="text-sm text-gray-400">Title</span>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Type post title here..."
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Content</span>
              <Controller
                name="content"
                control={control}
                defaultValue=""
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <Editor
                    apiKey="btnhknzsdtdbu8ck8nwda9fxjxrlb2euoccuw6rfr5otxf02"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue=""
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                )}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Category</span>
              <select
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                {...register("categoryId", {
                  required: "Category is required",
                })}
              >
                <option value="">Select category</option>
                {categoryBlogs.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Tags</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-grow p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Type tag and press enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                />
                <button
                  type="button"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleAddTag}
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white px-2 py-1 rounded-lg flex items-center gap-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Status</span>
              <select
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                {...register("status", { required: "Status is required" })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
