import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from 'react';

const products = [
  { id: 1, name: "Sản phẩm A", image: "https://via.placeholder.com/100" },
  { id: 2, name: "Sản phẩm B", image: "https://via.placeholder.com/100" },
];
const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [flyingItem, setFlyingItem] = useState(null);
  const cartIconRef = useRef(null);
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 });

  // Hàm cập nhật vị trí icon giỏ hàng khi resize
  const updateCartPosition = () => {
    if (cartIconRef.current) {
      const rect = cartIconRef.current.getBoundingClientRect();
      setCartPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  };

  useEffect(() => {
    updateCartPosition();
    window.addEventListener("resize", updateCartPosition);
    return () => window.removeEventListener("resize", updateCartPosition);
  }, []);

  const handleAddToCart = (product, event) => {
    // Lấy vị trí của nút bấm
    const rect = event.target.getBoundingClientRect();

    setFlyingItem({
      id: product.id,
      image: product.image,
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
    });

    // Khi animation kết thúc, thêm vào giỏ hàng và xóa hiệu ứng bay
    setTimeout(() => {
      setCartItems((prev) => [...prev, product]);
      setFlyingItem(null);
    }, 800);
  };

  return (
    <div className="relative">
      {/* Danh sách sản phẩm */}
      <div className="product-list grid grid-cols-2 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="product p-4 border rounded-lg">
            <img src={product.image} alt={product.name} className="w-24 h-24 mx-auto" />
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded w-full"
              onClick={(e) => handleAddToCart(product, e)}
            >
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>

      {/* Icon giỏ hàng trên header */}
      <div
        ref={cartIconRef}
        className="cart-icon fixed top-5 right-5 text-3xl bg-white p-2 shadow-lg rounded-full"
      >
        🛒 <span className="text-lg">({cartItems.length})</span>
      </div>

      {/* Hiệu ứng sản phẩm bay lên giỏ hàng */}
      <AnimatePresence>
        {flyingItem && (
          <motion.img
            src={flyingItem.image}
            alt="Flying Item"
            initial={{ x: flyingItem.startX, y: flyingItem.startY, opacity: 1, scale: 1 }}
            animate={{ x: cartPosition.x, y: cartPosition.y, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed w-16 h-16 z-50"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default CheckoutPage