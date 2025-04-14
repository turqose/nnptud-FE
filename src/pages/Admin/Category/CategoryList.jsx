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
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axiosInstance from "../../../api/axiosConfig";
import {
  deleteCategoryProduct,
  getCategoryProducts,
} from "../../../features/categoryProduct/categoryProductSlice";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categoryProducts = [], loading, total, pages } = useSelector(
    (state) => state.categoryProducts
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [limit, setLimit] = useState(10);
  const totalPages = pages;

  useEffect(() => {
    dispatch(getCategoryProducts({ page: currentPage, limit }));
  }, [currentPage, dispatch, limit]);

  const toggleSelectAll = () => {
    setSelectedCategories(
      selectedCategories.length === categoryProducts.length
        ? []
        : categoryProducts.map((c) => c.id)
    );
  };

  const navigate = useNavigate();

  const toggleSelect = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedCategories = [...categoryProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCategoryProduct(categoryToDelete.category_id)).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      await dispatch(getCategoryProducts({ page: currentPage, limit })).unwrap();
    }
    closeDeleteDialog();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      try {
        await axiosInstance.post("/category-products/bulk", json);
        toast.success("Categories imported successfully");
        dispatch(getCategoryProducts({ page: currentPage, limit }));
      } catch (error) {
        console.error(error);
        toast.error("Failed to import categories");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(categoryProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "categories.xlsx");
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when limit changes
    dispatch(
      getCategoryProducts({
        page: 1,
        limit: Number(event.target.value),
      })
    );
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.min(3, totalPages); i++) pageNumbers.push(i);
    if (currentPage > 3) pageNumbers.push("...");
    for (let i = Math.max(currentPage, 4); i <= Math.min(currentPage + 2, totalPages); i++) {
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
    }
    if (Math.min(currentPage + 2, totalPages) < totalPages - 3) pageNumbers.push("...");
    for (let i = Math.max(totalPages - 2, Math.min(currentPage + 2, totalPages) + 1); i <= totalPages; i++) {
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
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
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
                currentPage === page ? "bg-gray-300 dark:bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          )
        )}
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

  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Category</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Category List</span>
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
                onClick={() => navigate("/admin/add-category")}
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search product..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      checked={selectedCategories.length === categoryProducts.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Category Name
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
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories
                  .filter((category) =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((category) => (
                    <tr
                      key={category.category_id}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleSelect(category.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              import.meta.env.VITE_API_URL +
                                "/" +
                                category.image || "/placeholder.svg"
                            }
                            crossOrigin="anonymous"
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            category.slug === "Active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {category.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                            onClick={() =>
                              navigate(`/admin/edit-category/${category.category_id}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                            onClick={() => openDeleteDialog(category)}
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
              {currentPage * limit - limit + 1}-{Math.min(currentPage * limit, total)} of {total}
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
                    Delete Category
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
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

export default CategoryList;
