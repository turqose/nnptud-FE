import { Grid, List, X } from "lucide-react";
import Slider from "rc-slider";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HoverAction from "../../components/product/HoverAction";
import { getCategoryProducts } from "../../features/categoryProduct/categoryProductSlice";
import { getProducts } from "../../features/product/productSlice";
import formatCurrency from "../../utils/formatMoney";
const MIN_PRICE = 0;
const MAX_PRICE = 10000000;
const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);

  const dispatch = useDispatch();
  const [view, setView] = React.useState("grid");
  const { categoryProducts } = useSelector((state) => state.categoryProducts);
  const { products, loading, error, total, pages } = useSelector(
    (state) => state.products
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getCategoryProducts({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  const [sortBy, setSortBy] = useState("alphabetically");
  const [selectedCategories, setSelectedCategories] = useState([]);
console.log("build with vite");
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
       setSelectedCategories([decodeURIComponent(category)]);
       dispatch(
          getProducts({
            page: 1,
            limit,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            categories: [decodeURIComponent(category)],
            sortBy,
          })
        );
    }
  }, [location.search]);

  useEffect(() => {
    console.log("cate: " +selectedCategories);
    dispatch(
      getProducts({
        page: currentPage,
        limit,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        categories: selectedCategories,
        sortBy,
      })
    );
  }, [dispatch, currentPage, priceRange, selectedCategories, sortBy]);

  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelectedCategories);
    setCurrentPage(1);
    const queryParams = new URLSearchParams(location.search);
    if (newSelectedCategories.length > 0) {
      queryParams.delete("category");
    }
    navigate({ search: queryParams.toString() }, { replace: true });
    dispatch(
      getProducts({
        page: 1,
        limit,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        categories: newSelectedCategories,
        sortBy,
      })
    );
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
    dispatch(
      getProducts({
        page: 1,
        limit,
        minPrice: range[0],
        maxPrice: range[1],
        categories: selectedCategories,
        sortBy,
      })
    );
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    dispatch(
      getProducts({
        page: 1,
        limit,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        categories: selectedCategories,
        sortBy: sort,
      })
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSortBy("alphabetically");
    setCurrentPage(1);
    dispatch(
      getProducts({
        page: 1,
        limit,
        minPrice: MIN_PRICE,
        maxPrice: MAX_PRICE,
        categories: [],
        sortBy: "alphabetically",
      })
    );
  };

  const renderPagination = () => {
    const pageNumbers = [];

    // Add first 3 pages
    for (let i = 1; i <= Math.min(3, pages); i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if current page is beyond 3
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Add current page and next 2 pages
    const startCurrent = Math.max(currentPage, 4);
    const endCurrent = Math.min(currentPage + 2, pages);
    for (let i = startCurrent; i <= endCurrent; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis if there are more pages at the end
    if (endCurrent < pages - 3) {
      pageNumbers.push("...");
    }

    // Add last 3 pages
    const lastStart = Math.max(pages - 2, endCurrent + 1);
    for (let i = lastStart; i <= pages; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 ${
                currentPage === page ? "bg-gray-300" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header với breadcrumb và dropdown sắp xếp */}
      <div className="flex  flex-row justify-between items-center mb-6 flex-wrap">
        <div className="flex items-center gap-2 mb-4 md:mb-0 text-center">
          <h2 className="text-lg font-semibold">Filter</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border bg-white px-4 py-2"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`rounded-lg p-2 ${
                  view === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-lg p-2 ${
                  view === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid chính */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-16">
        {/* Sidebar */}
        <aside className="md:w-[240px] space-y-8 md:sticky md:top-8 md:self-start md:max-h-[calc(100vh-2rem)] md:overflow-y-auto ">
          {/* Danh mục sản phẩm */}
          <div className="">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">CATEGORIES</h2>
              {(selectedCategories.length > 0 ||
                priceRange[0] !== MIN_PRICE ||
                priceRange[1] !== MAX_PRICE) && (
                <button onClick={handleClearFilters} className="mb-4 text-sm">
                  <X className="h-4 w-4 inline-block" />
                </button>
              )}
            </div>
            <ul className="space-y-2 mr-2">
              {categoryProducts.map((category, index) => (
                <li key={index}>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCategories.includes(category.slug)}
                      onChange={() => handleCategoryChange(category.slug)}
                    />
                    <span className="flex-1">{category.name}</span>
                    <span className="text-sm text-gray-500">
                      ({category?.products?.length ?? 0})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Bộ lọc khoảng giá */}
          <div className="mx-2">
            <h2 className="text-lg font-semibold mb-4">PRICE RANGE</h2>
            <Slider
              // key={minPrice + "-" + maxPrice} // Add key to force re-render
              range
              key={`${priceRange[0]}-${priceRange[1]}`}
              min={MIN_PRICE}
              max={MAX_PRICE}
              defaultValue={priceRange}
              onChangeComplete={handlePriceRangeChange}
              className="mt-4"
            />
            <div className="flex justify-between mt-2">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </div>
        </aside>

        {/* Grid sản phẩm */}
        <main className="">
          <div className="min-h-screen mb-8">
            {products.length === 0 ? (
              <p className="text-center text-gray-500">No products available</p>
            ) : (
              <div
                className={`${
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }`}
              >
                {products.map((product) => (
                  <Link to={`/shop/${product.slug}`} key={product.product_id}>
                    <div
                      className={`group relative ${
                        view === "list" ? "flex gap-4" : ""
                      }`}
                    >
                      {/* Ảnh sản phẩm */}
                      <div
                        className={`relative aspect-square overflow-hidden rounded-lg ${
                          view === "list" ? "w-1/3" : ""
                        }`}
                      >
                        <img
                          src={
                            import.meta.env.VITE_API_URL +
                              "/" +
                              product?.images[0]?.url || "/placeholder.svg"
                          }
                          alt={product.name}
                          crossOrigin="anonymous"
                          className="object-cover w-full h-full object-center transition-transform group-hover:scale-105"
                        />
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
                        <HoverAction />
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div
                        className={`mt-4 space-y-2 ${
                          view === "list" ? "w-2/3" : ""
                        }`}
                      >
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {formatCurrency(
                              (product.price * (100 - product.discount)) / 100
                            )}
                          </p>
                          {product.discount && product.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {renderPagination()}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
