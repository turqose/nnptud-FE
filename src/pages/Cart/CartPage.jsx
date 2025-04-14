import { Button } from "@headlessui/react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CartItems from "../../components/cart/CartItem";
import CartProgress from "../../components/cart/CartProgress";
import CartSummary from "../../components/cart/CartSummary";
import CheckoutForm from "../../components/cart/CheckoutForm";
import CouponForm from "../../components/cart/CouponForm";
import OrderSummary from "../../components/cart/OrderSummary";
import GlobalLoading from "../../components/GlobalLoading/GlobalLoading";

import axiosInstance from "../../api/axiosConfig";
import {
  clearCartState,
  getCart,
  removeFromCart,
  updateCart,
} from "../../features/cart/cartSlice";
import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatMoney";

const CartPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, loadingCart } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [totalAm, setTotalAm] = useState(0);
  useEffect(() => {
    if (userInfo) {
      dispatch(getCart());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stepQuery = parseInt(query.get("step"), 10);

    if (loadingCart) return; // Chờ dữ liệu cart load xong

    if (![1, 2, 3].includes(stepQuery)) {
      setStep(1);
      query.set("step", "1");
      navigate({ search: query.toString() }, { replace: true });
    } else {
      setStep(stepQuery);
    }
  }, [cartItems.length, loadingCart, location.search, navigate, userInfo]);

  const [shippingMethod, setShippingMethod] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [step, setStep] = useState(1);

  const updateQuantity = async (id, newQuantity) => {
    try {
      await dispatch(updateCart({ id, quantity: newQuantity })).unwrap();
      await dispatch(getCart()).unwrap();
      toast.success("Quantity updated");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to update quantity");
        return;
      }
      if (error.response?.status === 402) {
        return;
      }
      toast.error(error.message || "Error updating quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await dispatch(removeFromCart(id)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message || "Error removing item");
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shippingCosts = useMemo(
    () => ({
      free: 0,
      express: 15000.0,
      pickup: 21000.0,
    }),
    []
  );

  const total = useMemo(
    () => subtotal + shippingCosts[shippingMethod],
    [subtotal, shippingMethod, shippingCosts]
  );
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setTotalAm(total);
      const orderData = await axiosInstance.post(
        "/orders",
        {
          ...formData,
          shipping: shippingCosts[shippingMethod],
          method: shippingMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(orderData);
      if (formData.paymentMethod === "cod") {
        setLoading(false);
        toast.success("Order submitted successfully");
        setStepWithQuery(3);
        dispatch(clearCartState());
      }
      if (formData.paymentMethod === "credit-card") {
        setLoading(false);
        toast.success("Redirecting to payment gateway");
        setStepWithQuery(3);
        dispatch(clearCartState());
      }
      if (formData.paymentMethod === "momo") {
        try {
          const response = await axiosInstance.post(
            "/orders/payment-with-momo",
            {
              total: Number(total) + Number(shippingCosts[shippingMethod]),
              orderId: orderData.data.data.order_id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          setLoading(false);
          window.open(response.data, "_blank");
        } catch (error) {
          setLoading(false);
          if (error.response?.status === 402) {
            return;
          }
          toast.error(error.response.data.error || "Error submitting order");
          setTimeout(() => {
            dispatch(clearCartState());
          }, 3000);
        }

        // Redirect to MoMo payment gateway

        setTimeout(() => {
          dispatch(clearCartState());
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 402) {
        return;
      }
      toast.error(error.response.data.error || "Error submitting order");
    }
  };

  const setStepWithQuery = (newStep) => {
    if (newStep === 2 && (!userInfo || cartItems.length === 0)) {
      toast.error("Please login and ensure your cart is not empty to proceed.");
      return;
    }

    setStep(newStep); // Cập nhật state
    const query = new URLSearchParams(location.search);
    query.set("step", newStep);
    navigate({ search: query.toString() }, { replace: true });
  };
  const handleBack = () => {
    if (step > 1) {
      setStepWithQuery(step - 1);
    }
  };

  const steps = [
    { number: 1, label: "Shopping cart" },
    { number: 2, label: "Checkout details" },
    { number: 3, label: "Order complete" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      {loading && <GlobalLoading />}
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl">
          Cart
        </h1>

        <CartProgress currentStep={step} steps={steps} />
        {step === 1 && (
          <div className="mt-6 space-y-6 sm:mt-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0">
            <div className="lg:col-span-8">
              <CartItems
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
              <div className="mt-6">
                <CouponForm />
              </div>
            </div>

            <div className="lg:col-span-4">
              <CartSummary
                subtotal={subtotal}
                shipping={shippingCosts[shippingMethod]}
                total={total}
                shippingMethod={shippingMethod}
                onShippingChange={setShippingMethod}
                onClick={() => setStepWithQuery(2)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="mt-6 space-y-6 sm:mt-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0">
              <div className="lg:col-span-7">
                <CheckoutForm onSubmit={handleSubmit} />
              </div>
              <div className="lg:col-span-5">
                <OrderSummary
                  items={cartItems}
                  shippingMethod={shippingMethod}
                  shippingCost={shippingCosts[shippingMethod]}
                />
              </div>
            </div>
            <button
              onClick={handleBack}
              className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Back
            </button>
          </>
        )}

        {step === 3 && (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 text-center shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-medium sm:text-2xl">
                Thank you! 🎉
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Your order has been received
              </p>

              <div className="mx-auto mb-8 max-w-sm space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-start">Order code:</span>
                  <span className="font-medium text-end">{uuidv4()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(Date.now())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formatCurrency(totalAm)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment method:</span>
                  <span className="font-medium">
                    {paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 sm:space-x-4 sm:space-y-0">
                <button className=" py-1.5 px-3 bg-slate-400 text-white font-semibold rounded-2xl shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95">
                  <Link to="/account/orders">Purchase history</Link>
                </button>
                <Button className="inline-flex items-center gap-2 rounded-2xl bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
