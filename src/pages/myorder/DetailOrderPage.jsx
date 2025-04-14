import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById } from "../../features/orders/orderSlice";
import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatMoney";

const DetailOrderPage = () => {
  const { id } = useParams();
  const { order } = useSelector((state) => state.orders);
  console.log(order);
  const dispatch = useDispatch();
  const statusSteps = [
    { id: "01", name: "Order received", status: "received" },
    { id: "02", name: "Pending", status: "Pending" },
    { id: "03", name: "Paid", status: "Paid" },
    { id: "04", name: "Completed", status: "Completed" },
    { id: "05", name: "Cancelled", status: "Cancelled" },
  ];
  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const getCurrentStep = () => {
    const statusIndex = statusSteps.findIndex(
      (step) => step.status === order.status
    );
    return statusIndex + 1;
  };

  return (
    <div className="  ">
      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-8">
          <Link
            to="/account/orders"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        <div className="">
          {order.order_id && (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold">Order Details</h1>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {order.items.length} Products
                  </span>
                </div>
                <Link
                  to="/account/orders"
                  className="text-green-500 hover:text-green-600 transition-colors"
                >
                  Back to List
                </Link>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 ">
                <div className="lg:flex-1 space-y-6">
                  {/* Addresses */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Billing Address */}
                    <div className="bg-white  rounded-lg shadow-sm flex-1">
                      <h2 className="text-gray-500 text-sm font-medium mb-4">
                        BILLING ADDRESS
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">
                            {order.address.full_name}
                          </h3>
                          <p className="text-gray-600">
                            {order.address.address_line1 +
                              ", " +
                              order.address.address_line2 +
                              ", " +
                              order.address.city +
                              ", " +
                              order.address.state +
                              ", " +
                              order.address.country +
                              ", " +
                              order.address.postal_code}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-gray-500 text-sm">EMAIL</h4>
                          <p>{order.user.email}</p>
                        </div>
                        <div>
                          <h4 className="text-gray-500 text-sm">PHONE</h4>
                          <p>{order.address.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative flex justify-between px-4 sm:px-0">
                    {/* Progress Line */}
                    <div className="absolute left-0 top-[15px] h-[5px] w-full bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${
                            ((getCurrentStep() - 1) /
                              (statusSteps.length - 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    {statusSteps.map((step, index) => {
                      const isCurrent = getCurrentStep() === index + 1;
                      const isComplete = getCurrentStep() > index + 1;
                      return (
                        <div
                          key={step.id}
                          className="flex flex-col items-center relative z-10"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${
                          isComplete
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-green-500 text-white"
                            : "border-2 border-dashed border-gray-300 text-gray-500"
                        }`}
                          >
                            {isComplete ? (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              step.id
                            )}
                          </div>
                          <span className="mt-2 text-sm font-medium text-gray-600">
                            {step.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Products Table */}
                </div>

                {/* Order Summary */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm  ">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">ORDER ID:</span>
                    <span className="font-medium">#{order.order_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      PAYMENT METHOD:
                    </span>
                    <span className="font-medium">{order.payment?.payment_method.toUpperCase()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Subtotal:</span>
                      <span> {formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Discount:</span>
                      <span>{0}%</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Shipping:</span>
                      <span> {formatCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="font-medium">Total</span>
                      <span className="text-green-500 text-xl font-semibold">
                        {formatCurrency(Number(order.total) + Number(order.shipping))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left cursor-pointer uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left cursor-pointer uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left cursor-pointer uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left cursor-pointer uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0">
                              <img
                                src={
                                  import.meta.env.VITE_API_URL +
                                    "/" +
                                    product.product.images[0].url ||
                                  "/placeholder.svg"
                                }
                                alt={product.product.name}
                                width={64}
                                height={64}
                                crossOrigin="anonymous"
                                className="rounded-lg object-cover w-full h-full"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(product.product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          x{product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(
                            product.product.price * product.quantity
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailOrderPage;
