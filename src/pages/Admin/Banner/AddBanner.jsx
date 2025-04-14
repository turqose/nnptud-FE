import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GlobalLoading from "../../../components/GlobalLoading/GlobalLoading";
import {
  addBanner,
  fetchBannerById,
  updateBanner,
} from "../../../features/banner/bannerSlice";
const AddBanner = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [bannerData, setBannerData] = useState({
    title: "",
    status: "active",
    image: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchBannerById(id)).then((response) => {
        const banner = response.payload;
        for (const [key, value] of Object.entries(banner)) {
          setValue(key, value);
        }
        setBannerData({
          title: banner.title,
          status: banner.status,
          image: banner.image,
        });
      });
    }
  }, [id, dispatch, setValue]);

  const handleImageUpload = (event) => {
    event.preventDefault(); // Prevent form submission
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setBannerData((prevData) => ({
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
    setBannerData((prevData) => ({
      ...prevData,
      image: null,
    }));
    setError("");
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    setValue("title", title);
    setBannerData((prevData) => ({
      ...prevData,
      title,
    }));
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setBannerData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { title, status, image } = bannerData;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("status", status);
      if (image) {
        formData.append("image", image);
      }

      if (id) {
        await dispatch(updateBanner({ id, formData })).unwrap();
        toast.success("Banner updated successfully");
        navigate(-1);
      } else {
        await dispatch(addBanner(formData)).unwrap();
        toast.success("Banner added successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to save banner: ", error);
      toast.error(error.message ?? error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      {isLoading && <GlobalLoading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {id ? "Edit Banner" : "Add Banner"}
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
              <PlusIcon size={16} /> {id ? "Update Banner" : "Add Banner"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-semibold">Thumbnail</h3>
            <p className="text-sm text-gray-400">Photo</p>
            <label className="border-dashed border-2 flex flex-col items-center justify-center h-40 rounded-lg cursor-pointer border-gray-400 dark:border-gray-600">
              {bannerData.image ? (
                <div className="relative h-full w-full">
                  <img
                    src={
                      bannerData.image instanceof File
                        ? URL.createObjectURL(bannerData.image)
                        : `${import.meta.env.VITE_API_URL}/${bannerData.image}`
                    }
                    alt="Preview"
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover rounded-lg"
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
              <span className="text-sm text-gray-400">Banner Title</span>
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Type banner title here..."
                {...register("title", {
                  required: "Banner title is required",
                })}
                onChange={handleTitleChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.title.message}
                </p>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-sm text-gray-400">Status</span>
              <select
                className="w-full p-2 border rounded-lg mt-1 border-gray-400 bg-white text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={bannerData.status}
                onChange={handleStatusChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;
