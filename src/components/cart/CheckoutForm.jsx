"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAddresses } from "../../features/address/addressSlice";

export default function CheckoutForm({ onSubmit }) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.address);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAddresses());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.is_default);
    if (defaultAddress) {
      for (const [key, value] of Object.entries(defaultAddress)) {
        setValue(key, value);
      }
    }
  }, [addresses, setValue]);

  const defaultAddress = addresses.find((address) => address.is_default);

  const handleFormSubmit = (data) => {
    if(!defaultAddress) {
       toast.error("Please add an address to continue");
      return;
    }
    const orderDetails = {
      address_id: defaultAddress.address_id,
      items: cartItems.map((item) => ({
        name: item.product.name,
        price: (item.product.price * (100 - item.product.discount)) / 100,
        quantity: item.quantity,
        product_id: item.product.product_id,
        images: item.product.images,
      })),
      paymentMethod,
    };
    onSubmit(orderDetails);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Default Address */}
      {defaultAddress ? (
        <div className="rounded-lg bg-white p-6 border border-gray-200">
          <h2 className="text-lg font-medium">Default Address</h2>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-900">
              {defaultAddress.full_name}
            </p>
            <p className="text-sm text-gray-500">{defaultAddress.phone}</p>
            <p className="text-sm text-gray-500">
              {defaultAddress.address_line1},{" "}
              {defaultAddress.address_line2 &&
                `${defaultAddress.address_line2}, `}
              {defaultAddress.city}, {defaultAddress.state},{" "}
              {defaultAddress.country}, {defaultAddress.postal_code}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() =>
                navigate("/account/address", { state: { fromCheckout: true } })
              }
              className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
            >
              Select a Different Address
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 border border-gray-200">
          <h2 className="text-lg font-medium">No Address Found</h2>
          <div className="mt-4">
            <Link
              to="/account/address/add"
              className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
            >
              Add New Address
            </Link>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="rounded-lg bg-white p-6 border border-gray-200">
        <h2 className="text-lg font-medium">Payment Method</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="radio"
              id="credit-card"
              name="paymentMethod"
              value="credit-card"
              checked={paymentMethod === "credit-card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 border-gray-300 text-black focus:ring-black"
            />
            <label
              htmlFor="credit-card"
              className="text-sm font-medium text-gray-700"
            >
              Thanh toán với ngân hàng
            </label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              id="momo"
              name="paymentMethod"
              value="momo"
              checked={paymentMethod === "momo"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="momo" className="text-sm font-medium text-gray-700">
              MoMo
            </label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="cod" className="text-sm font-medium text-gray-700">
              Cash on Delivery
            </label>
          </div>

          {paymentMethod === "credit-card" && (
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="qrCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Scan QR Code
                </label>
                <img
                  src="/path/to/qr-code.png"
                  alt="QR Code"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
      >
        Place Order
      </button>
    </form>
  );
}
