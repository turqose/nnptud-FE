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
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  deleteOrder,
  getAllOrdersByAdmin,
  updateOrder,
} from "../../../features/orders/orderSlice";
import formatDate from "../../../utils/formatDate";
import formatCurrency from "../../../utils/formatMoney";

const OrderList = () => {
   const dispatch = useDispatch();
  const {
    ordersByAdmin  ,
    loading,
    total,
    pages,
  } = useSelector((state) => state.orders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const limit = 10;

  useEffect(() => {
    dispatch(getAllOrdersByAdmin({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);
  console.log(ordersByAdmin)

  const toggleSelectAll = () => {
    if (selectedOrders.length === ordersByAdmin.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(ordersByAdmin.map((o) => o.order_id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((o) => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pages) {
      setCurrentPage(page);
      dispatch(getAllOrdersByAdmin({ page, limit }));
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...ordersByAdmin].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    return (
      (!dateFilter || order.date === dateFilter) &&
      (!statusFilter || order.status === statusFilter) &&
      (order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_id.toString().includes(searchQuery))
    );
  });

  const openDeleteDialog = (order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteOrder(orderToDelete.order_id)).unwrap();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      await dispatch(getAllOrdersByAdmin({ page: currentPage, limit })).unwrap();
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
    const worksheet = XLSX.utils.json_to_sheet(ordersByAdmin);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrder({ id: orderId, status: newStatus })).unwrap();
      toast.success("Order status updated successfully");
      dispatch(getAllOrdersByAdmin({ page: currentPage, limit }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 dark:bg-[#081028] dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-700 bg-white dark:bg-[#081028]">
          {/* Top section */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold">Orders</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/admin">Dashboard</Link>
                <ChevronRight className="h-4 w-4" />
                <span>Order List</span>
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
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Order
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 border-t border-gray-300 p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search orders..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                className="rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <select
                className="rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
                      checked={selectedOrders.length === ordersByAdmin.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("customer")}>
                    <div className="flex items-center gap-2">
                      Customer
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("productName")}>
                    <div className="flex items-center gap-2">
                      Product Name
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("total")}>
                    <div className="flex items-center gap-2">
                      Total
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-2">
                      Date
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-2">
                      Status
                      <ChevronsUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-b border-gray-300 dark:border-gray-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 bg-gray-300 checked:bg-purple-600 dark:bg-gray-700 dark:border-gray-600"
                        checked={selectedOrders.includes(order.order_id)}
                        onChange={() => toggleSelect(order.order_id)}
                      />
                    </td>
                    <td className="px-6 py-4">{order.user.full_name}</td>
                    <td className="px-6 py-4">{order.items[0]?.product?.name}</td>
                    <td className="px-6 py-4">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      <select
                        className="rounded-lg border border-gray-300 bg-white py-1 px-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#081028] dark:text-white dark:border-gray-600"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                        type="button"
                        className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-300 rounded-lg dark:hover:bg-gray-700" onClick={() => openDeleteDialog(order)}>
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
              {Math.min((currentPage - 1) * limit + 1, total)}-
              {Math.min(currentPage * limit, total)} of {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(pages)].map((_, index) => (
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
                disabled={currentPage === pages}
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
                    Delete Order
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the order from "
                      {orderToDelete?.customer}"? This action cannot be undone.
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
}

export default OrderList;
