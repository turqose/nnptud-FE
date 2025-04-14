import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css"; // Import the slick carousel theme
import "slick-carousel/slick/slick.css"; // Import the slick carousel styles
import axiosInstance from "../../api/axiosConfig";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";
import ImageMagnifier from "../../components/ImageMagnifier"; // Import the ImageMagnifier component
import {
  addToCart,
  clearFlyingItem,
  getCart,
  setFlyingItem,
} from "../../features/cart/cartSlice";
import { fetchProductBySlug } from "../../features/product/productSlice";
import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatMoney";

const tabs = [
  "Description",
  "Ingredients",
  "Adverse Effects",
  "Dosage",
  "Usage",
  "Careful",
  "Preservation",
  "Reviews",
];

const SingleProductPage = () => {
  const { slug } = useParams();
  const { product, relatedProducts, loading, error, totalRating } = useSelector(
    (state) => state.products
  );
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [filter, setFilter] = useState("newest");
  const [newReview, setNewReview] = useState({
    rating: 0,
    content: "",
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login to submit review");
      return;
    }
    try {
      await axiosInstance.post("/products/review", {
        product_id: product.product_id,
        rating: newReview.rating,
        content: newReview.content,
      });
      await dispatch(fetchProductBySlug(slug)).unwrap();
      toast.success("Review submitted successfully");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.error ?? "An error occurred. Please try again."
      );
    }
  };

  const handleAddToCart = async (event) => {
    if (!userInfo) {
      toast.error("Please login to add product to cart");
      return;
    }
    const rect = event.target.getBoundingClientRect();
    console.log(rect);
    // Set thông tin item bay
    dispatch(
      setFlyingItem({
        id: product.id,
        image: product.images[0].url,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
      })
    );

    try {
      await dispatch(
        addToCart({ productId: product.product_id, quantity })
      ).unwrap();
      await dispatch(getCart()).unwrap();
      setTimeout(() => {
        dispatch(clearFlyingItem());
      }, 800);
      toast.success("Product added to cart successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error("An error occurred. Please try again.");
    }
  };

  const previousSlide = () => {
    setSelectedImageIndex((curr) =>
      curr === 0 ? product.images.length - 1 : curr - 1
    );
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].offsetWidth;
      sliderRef.current.scrollTo({
        left:
          (selectedImageIndex - 1) * slideWidth - 
          sliderRef.current.offsetWidth / 2 +
          slideWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => {
    setSelectedImageIndex((curr) =>
      curr === product.images.length - 1 ? 0 : curr + 1
    );
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].offsetWidth;
      sliderRef.current.scrollTo({
        left:
          (selectedImageIndex + 1) * slideWidth - 
          sliderRef.current.offsetWidth / 2 +
          slideWidth / 2,
        behavior: "smooth",
      });
    }
  };
  // in ra type của product?.ingredients
  console.log(product?.ingredients);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <GlobalLoading />}
      {error && <p className="text-red-500">{error}</p>}

      {product && product.sku != null && (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="flex flex-col">
              <div className="relative">
                <div className="absolute left-2 top-2 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="rounded bg-green-400 px-2 py-1 text-xs font-semibold text-white">
                      NEW
                    </div>
                  )}
                  {product.discount && product.discount > 0 && (
                    <div className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                <div className="relative overflow-hidden rounded-lg h-[600px]">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={` relative overflow-hidden rounded-lg `}
                    >
                      <ImageMagnifier
                        src={
                          import.meta.env.VITE_API_URL +
                            "/" +
                            product.images[selectedImageIndex].url ||
                          "/placeholder.svg"
                        }
                        alt="Tray Table"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={previousSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous slide</span>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next slide</span>
                </button>
              </div>
              <div
                className="flex mt-4 space-x-2 overflow-x-auto"
                ref={sliderRef}
              >
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={
                      import.meta.env.VITE_API_URL + "/" + image.url ||
                      "/placeholder.svg"
                    }
                    crossOrigin="anonymous"
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover cursor-pointer ${
                      index === selectedImageIndex
                        ? "border-2 border-black"
                        : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < totalRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.reviews.length} Reviews
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>

                {/* <p className="text-gray-600">{}</p> */}
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-bold">
                  {formatCurrency(
                    (product.price * (100 - product.discount)) / 100
                  )}
                </span>
                {product.discount && product.discount > 0 && (
                  <span className="text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Product Metadata */}
              <div className="pt-6 border-t space-y-2 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span>SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex gap-2">
                  <span>Brand:</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex gap-2">
                  <span>Origin:</span>
                  <span>{product.origin}</span>
                </div>
                <div className="flex gap-2">
                  <span>Expiry Date:</span>
                  <span>
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>Manufacturing Date:</span>
                  <span>
                    {new Date(product.manufacturingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex gap-4 items-center">
                <div className="flex border rounded-md">
                  <button
                    className="px-3 py-1 border-r hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    className="px-3 py-1 border-l hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Tabs */}
          <div className="container mx-auto px-4 py-8">
            <TabGroup>
              <TabList className="flex border-b flex-wrap">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `px-4 py-2 text-sm font-medium focus:outline-none ${
                        selected
                          ? "border-b-2 border-black text-black"
                          : "text-gray-500 hover:text-black"
                      }`
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                <TabPanel>
                  <div className="pt-6">
                    <p
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    ></p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    {/*  hiển thị table  */}
                    <div className="    overflow-hidden dark:bg-[#081028] dark:border-gray-700">
                    {product.ingredients}
                    { /*   <table className="w-full mt-4 border-collapse">
                        <thead>
                          <tr className="border-b border-gray-300 dark:border-gray-700">
                            <th className="border border-gray-300">
                              Ingredient
                            </th>
                            <th className="border border-gray-300">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                       {product.ingredients &&
                          
                          JSON.parse(product.ingredients)?.map(
                            (ingredient, index) => {
                              console.log(ingredient);
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-gray-300 dark:border-gray-700"
                                >
                                  <td className="px-3 py-2 border border-gray-300">
                                    {ingredient.ingredient}
                                  </td>
                                  <td className="px-3 py-2 border border-gray-300">
                                    {ingredient.amount}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                       
                        </tbody>
                      </table> */ }
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    <h2 className="text-xl font-semibold">Adverse Effects</h2>
                    <p className="text-gray-600">{product.adverseeffect}</p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    <h2 className="text-xl font-semibold">Dosage</h2>
                    <p className="text-gray-600">{product.dosage}</p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    <h2 className="text-xl font-semibold">Usage</h2>
                    <p className="text-gray-600">{product.usage}</p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    <h2 className="text-xl font-semibold">Careful</h2>
                    <p className="text-gray-600">{product.careful}</p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="pt-6">
                    <h2 className="text-xl font-semibold">Preservation</h2>
                    <p className="text-gray-600">{product.preservation}</p>
                  </div>
                </TabPanel>
                <TabPanel className="pt-6">
                  <div className="space-y-6">
                    {/* Reviews Header */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold">
                          Customer Reviews
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < totalRating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.reviews.length} Reviews
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="px-4 py-1 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
                          Write Review
                        </button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {product.reviews.length === 0 ? (
                      <p className="text-gray-600">No reviews yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {/* ...existing code for displaying reviews... */}
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">
                            {product.reviews.length} Reviews
                          </h3>
                          <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-lg border bg-white px-4 py-2"
                          >
                            <option value="newest">Newest</option>
                            <option value="featured">Featured</option>
                          </select>
                        </div>

                        <div className="space-y-6">
                          {product.reviews?.map((review, index) => (
                            <div key={index} className="flex gap-4">
                              <img
                                src={"/user.jpg"}
                                alt={review.user.full_name}
                                width={40}
                                height={40}
                                className="rounded-full w-[50px] h-[50px] object-cover"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">
                                      {review.user.full_name}
                                    </h4>
                                    <div className="flex gap-2 items-center">
                                      <div className="flex">
                                        {[...Array(review.rating)].map(
                                          (_, i) => (
                                            <svg
                                              key={i}
                                              className="w-4 h-4 text-yellow-400"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                          )
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(review.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-600">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button className="w-full py-2 text-sm font-medium text-gray-600 border rounded-md hover:bg-gray-50">
                          Load more
                        </button>
                      </div>
                    )}

                    {/* Submit Review Form */}
                    <div className="pt-6">
                      <h2 className="text-xl font-semibold">Write a Review</h2>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                onClick={() =>
                                  setNewReview({
                                    ...newReview,
                                    rating: i + 1,
                                  })
                                }
                                className={`w-6 h-6 cursor-pointer ${
                                  i < newReview.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Review
                          </label>
                          <textarea
                            value={newReview.content}
                            onChange={(e) =>
                              setNewReview({
                                ...newReview,
                                content: e.target.value,
                              })
                            }
                            className="mt-3 block w-full resize-none border border-gray-300 rounded-lg   bg-white/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                            rows={4}
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    to={`/shop/${relatedProduct.slug}`}
                    key={relatedProduct.product_id}
                  >
                    <div className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={
                            import.meta.env.VITE_API_URL +
                              "/" +
                              relatedProduct?.images[0]?.url ||
                            "/placeholder.svg"
                          }
                          alt={relatedProduct.name}
                          crossOrigin="anonymous"
                          className="object-cover w-full h-full object-center transition-transform group-hover:scale-105"
                        />
                        <div className="absolute left-2 top-2 flex flex-col gap-2">
                          {relatedProduct.isNew && (
                            <div className="rounded bg-green-400 px-2 py-1 text-xs font-semibold text-white">
                              NEW
                            </div>
                          )}
                          {relatedProduct.discount &&
                            relatedProduct.discount > 0 && (
                              <div className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                                -{relatedProduct.discount}%
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-500">
                          {relatedProduct.category}
                        </p>
                        <h3 className="text-lg font-medium line-clamp-3 min-h-[4.5em]">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {formatCurrency(
                              (relatedProduct.price *
                                (100 - relatedProduct.discount)) /
                                100
                            )}
                          </p>
                          {relatedProduct.discount &&
                            relatedProduct.discount > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                {formatCurrency(relatedProduct.price)}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleProductPage;
