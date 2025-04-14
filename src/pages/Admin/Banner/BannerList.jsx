import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronRight,
  ChevronsUpDown,
  Download,
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
import { deleteBanner, getBanners } from "../../../features/banner/bannerSlice";

const BannerList = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const totalPages = Math.ceil(banners.length / 10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);
  const toggleSelectAll = () => {
    if (selectedBanners.length === banners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map((b) => b.id));
    }
  };

  const navigate = useNavigate();

  const toggleSelect = (id) => {
    if (selectedBanners.includes(id)) {
      setSelectedBanners(selectedBanners.filter((b) => b !== id));
    } else {
      setSelectedBanners([...selectedBanners, id]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedBanners = [...banners].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const openDeleteDialog = (banner) => {
    setBannerToDelete(banner);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setBannerToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBanner(bannerToDelete.banner_id)).unwrap();
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      await dispatch(getBanners()).unwrap();
    }
    closeDeleteDialog();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log(json);
      // Process the imported data as needed
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(banners);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banners");
    XLSX.writeFile(workbook, "banners.xlsx");
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Banner</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Banner List</span>
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
                onClick={() => navigate("/admin/add-banner")}
              >
                <Plus className="h-4 w-4" />
                Add Banner
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search banner..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      checked={selectedBanners.length === banners.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-2">
                      Title
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
                {sortedBanners
                  .filter((banner) =>
                    banner.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map((banner) => (
                    <tr
                      key={banner.banner_id}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                          checked={selectedBanners.includes(banner.banner_id)}
                          onChange={() => toggleSelect(banner.banner_id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              import.meta.env.VITE_API_URL +
                                "/" +
                                banner.image || "/placeholder.svg"
                            }
                            crossOrigin="anonymous"
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          {banner.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            banner.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {banner.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                            onClick={() =>
                              navigate(`/admin/edit-banner/${banner.banner_id}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                            onClick={() => openDeleteDialog(banner)}
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
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-300 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentPage * 10 - 9}-
              {Math.min(currentPage * 10, banners.length)} of {banners.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    currentPage === index + 1
                      ? "bg-gray-300 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
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
                    Delete Banner
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the banner "
                      {bannerToDelete?.title}"? This action cannot be undone.
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
export default BannerList;
