import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, updateCart } from "../../features/cart/cartSlice";
import formatCurrency from "../../utils/formatMoney";
import { CartItemCard } from "./CartItemCard";

export function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // Add this line

  useEffect(() => {
    if (userInfo) { // Add this condition
      dispatch(getCart());
    }
  }, [dispatch, userInfo]); // Add isLoggedIn to dependencies

  const [shippingMethod, setShippingMethod] = useState("free");
  const [step, setStep] = useState(1);

  const updateQuantity = async (id, newQuantity) => {
    try {
      await dispatch(updateCart({ id, quantity: newQuantity })).unwrap();
      await dispatch(getCart()).unwrap();
      toast.success("Quantity updated");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Please login to update quantity");
        return;
      }
      if (error.response && error.response.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return;
      }
      toast.error(error.message || error.error || error.response.data.message);
      console.error("Error updating quantity:", error.response.data.message);
    }
  };

  const removeItem = async (id) => {
    try {
      await dispatch(removeFromCart(id)).unwrap();
    } catch (error) {
      toast.error(error.message || error.error || error.response.data.message);
      console.error("Error removing item:", error);
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );


  const total = useMemo(() => {
    const shippingCosts = {
      free: 0,
      express: 15000.0,
      pickup: 21000.0,
    };
    return subtotal + shippingCosts[shippingMethod];
  }, [subtotal, shippingMethod]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white px-6 py-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <DialogTitle className="text-lg font-semibold">Cart</DialogTitle>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-4">
              {" "}
              {/* Added pr-4 for spacing */}
              {cartItems.length === 0 ? (
                <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.cart_item_id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 pt-6 sm:px-6">
              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-900">
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>{formatCurrency(total)}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/checkout"
                    className="flex w-full items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white hover:bg-gray-900"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/cart"
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
