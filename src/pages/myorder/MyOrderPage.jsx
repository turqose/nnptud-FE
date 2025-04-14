import { Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../../features/orders/orderSlice";

const MyOrderPage = () => {
  const dispatch = useDispatch();
  const { orders, total, pages } = useSelector((state) => state.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getOrders({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pages) {
      setCurrentPage(page);
      dispatch(getOrders({ page, limit }));
    }
  };

  return (
    <div className="lg:col-span-9 lg:mt-0">
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm ">
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-2xl font-bold leading-6 text-gray-900">
            Orders History
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No orders
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your orders here.
            </p>
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product Details
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) =>
                    order.items.map((item, itemIndex) => (
                      <tr
                        key={`${itemIndex}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {itemIndex === 0 ? itemIndex + 1 : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {itemIndex === 0
                            ? new Date(order.created_at).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={
                                  import.meta.env.VITE_API_URL +
                                    "/" +
                                    item.product.images[0]?.url ||
                                  "/placeholder.svg"
                                }
                                crossOrigin="anonymous"
                                alt={item.product.name}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.product.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.product.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                          {Number.parseFloat(item.product.price).toLocaleString(
                            "vi-VN",
                            {
                              style: "currency",
                              currency: "VND",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                          {(
                            Number.parseFloat(item.product.price) *
                            item.quantity
                          ).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {itemIndex === 0 ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {order.status}
                            </span>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* edit  */}
                          <Link
                            to={`/account/orders/${order.order_id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
