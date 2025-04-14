import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import {
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
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { deleteBlog, getBlogs } from "../../../features/blogs/blogSlice";
import { getAllUsers } from "../../../features/user/userSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading, total, pages } = useSelector(
    (state) => state.blogPosts
  );
  const { users } = useSelector((state) => state.auth);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const totalPages = pages;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [authorFilter, setAuthorFilter] = useState("");

  useEffect(() => {
    dispatch(getBlogs({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const toggleSelectAll = () => {
    if (selectedPosts.length === blogs.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(blogs.map((p) => p.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((p) => p !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getBlogs({ page, limit: 10 }));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPosts = [...blogs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredPosts = sortedPosts.filter((post) => {
    console.log(authorFilter);
    return (
      (!authorFilter || post.authorName === authorFilter) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const openDeleteDialog = (post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBlog(postToDelete.id)).unwrap();
      // Optionally, show a success message
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(getBlogs({ page: currentPage, limit: 10 }));
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
    const worksheet = XLSX.utils.json_to_sheet(blogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");
    XLSX.writeFile(workbook, "posts.xlsx");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Posts</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Post List</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                type="button"
                onClick={() => navigate("/admin/add-post")}
              >
                <Plus className="h-4 w-4" />
                Add Post
              </button>
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
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search posts..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              >
                <option value="">All Authors</option>
                {users.map((author) => (
                  <option key={author.user_id} value={author.full_name}>
                    {author.full_name}
                  </option>
                ))}
              </select>
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
                      checked={selectedPosts.length === blogs.length}
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
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center gap-2">
                      Author
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
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
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  filteredPosts
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((post) => (
                      <tr
                        key={post.post_id}
                        className="border-b border-gray-300 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => toggleSelect(post.id)}
                          />
                        </td>
                        <td className="px-6 py-4">{post.title}</td>
                        <td className="px-6 py-4">{post.authorName}</td>
                        <td className="px-6 py-4">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              post.status === "published"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {post.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                              type="button"
                              onClick={() =>
                                navigate(`/admin/edit-post/${post.post_id}`)
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700"
                              onClick={() => openDeleteDialog(post)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-300 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentPage * 10 - 9}-{Math.min(currentPage * 10, total)} of{" "}
              {total}
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
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#081028]">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Delete Post
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the post "
                      {postToDelete?.title}"? This action cannot be undone.
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PostList;
