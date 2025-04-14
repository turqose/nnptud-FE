import { Dialog, Transition } from "@headlessui/react";
import {
  Calendar,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axiosInstance from "../../../api/axiosConfig";
import {
  deleteProduct,
  getProducts,
} from "../../../features/product/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, total, pages } = useSelector(
    (state) => state.products
  );
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const totalPages = pages; // Use the pages value from Redux state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Gọi API lấy danh sách sản phẩm khi có thay đổi về trang, limit hoặc tìm kiếm
  useEffect(() => {
    dispatch(
      getProducts({ page: currentPage, limit, search: debouncedSearchQuery })
    );
  }, [currentPage, limit, debouncedSearchQuery, dispatch]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const toggleSelect = useCallback((id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((p) => p !== id)
        : [...prevSelected, id]
    );
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      dispatch(
        getProducts({
          page,
          limit,
        })
      );
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      // Delete product
      await dispatch(deleteProduct(productToDelete.product_id)).unwrap();
      console.log("Product deleted successfully!");
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product: " + error.message || error.error);
    } finally {
      dispatch(getProducts());
    }
    closeDeleteDialog();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const CHUNK_SIZE = 100; // Number of rows per chunk

  const handleImport = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
 
      for (let i = 0; i < json.length; i += CHUNK_SIZE) {
        const chunk = json.slice(i, i + CHUNK_SIZE);
        try {
          await axiosInstance.post("/products/bulk", chunk);
          toast.success(`Chunk ${i / CHUNK_SIZE + 1} imported successfully!`);
        } catch (error) {
          console.error(error);
          toast.error(
            "Failed to import chunk: " + error.message || error.error
          );
          break; // Stop processing further chunks if an error occurs
        }
      }
      dispatch(
        getProducts({ page: currentPage, limit, search: debouncedSearchQuery })
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = async () => {
    const response = await axiosInstance.get("/products/export/data");
    const exportData = response.data.map(product => ({
      ...product,
      images: product?.images[0]?.url ? `${import.meta.env.VITE_API_URL}/${product.images[0].url}` : '',
      categories: product?.categories[0]?.name || ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  const deleteSelectedProducts = async () => {
    try {
      await  axiosInstance.delete("/products/all/bulk", {
        data: { ids: selectedProducts },
      });
      toast.success("Selected products deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete selected products: " + error.message || error.error);
    } finally {
     
      setSelectedProducts([]);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];

    // Add first 3 pages
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if current page is beyond 3
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Add current page and next 2 pages
    const startCurrent = Math.max(currentPage, 4);
    const endCurrent = Math.min(currentPage + 2, totalPages);
    for (let i = startCurrent; i <= endCurrent; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Add ellipsis if there are more pages at the end
    if (endCurrent < totalPages - 3) {
      pageNumbers.push("...");
    }

    // Add last 3 pages
    const lastStart = Math.max(totalPages - 2, endCurrent + 1);
    for (let i = lastStart; i <= totalPages; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={() => handlePageChange(currentPage - 1)}
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
              className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
                currentPage === page ? "bg-gray-300 dark:bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when limit changes
    dispatch(
      getProducts({
        page: 1,
        limit: Number(event.target.value),
      })
    );
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Product</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Product List</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-[#081028] dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={() => document.getElementById("import-input").click()}
              >
                <Download className="h-4 w-4" />
                Import
              </button>
              <input
                type="file"
                id="import-input"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleImport}
              />
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-[#081028] dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={handleExport}
              >
                <Upload className="h-4 w-4" />
                Export
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                type="button"
                onClick={() => navigate("/admin/add-product")}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
              {selectedProducts.length > 0 && (
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  type="button"
                  onClick={deleteSelectedProducts}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-200 dark:bg-[#081028] dark:border-gray-600 dark:hover:bg-gray-700">
                <Calendar className="h-4 w-4" />
                Select Dates
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-200 dark:bg-[#081028] dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-gray-300 rounded-xl overflow-hidden dark:bg-[#081028] dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedProducts.length === products.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Product Name
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-2">
                      Price
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("company")}
                  >
                    <div className="flex items-center gap-2">
                      Ảnh
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-gray-300 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {product?.categories[0]?.name}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            import.meta.env.VITE_API_URL +
                              "/" +
                              product?.images[0]?.url || "/placeholder.svg"
                          }
                          alt=""
                          crossOrigin="anonymous"
                          className="w-6 h-6 rounded-full"
                        />
                        {product.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.stock_status === "in_stock"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {product.stock_status.toUpperCase().replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                          type="button"
                          onClick={() => {
                            navigate(
                              `/admin/edit-product/${product.product_id}`
                            );
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                                          type="button"

                          className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="py-4 flex flex-wrap items-center justify-between border-t border-gray-300 dark:border-gray-700 gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentPage * limit - limit + 1}-
              {Math.min(currentPage * limit, total)} of {total}
            </div>
            {renderPagination()}
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="limit"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Items per page:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#081028]">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Delete Product
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the product "
                      {productToDelete?.name}"? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      onClick={closeDeleteDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
export default ProductList;
