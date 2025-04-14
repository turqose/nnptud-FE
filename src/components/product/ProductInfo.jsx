import React from "react";
import formatCurrency from "../../utils/formatMoney";

const ProductInfo = ({ product, view }) => {
  return (
    <div className={view === "list" ? "flex-1 space-y-2" : "mt-4 space-y-2"}>
      <RatingStars rating={product.rating} />
      <h3 className="text-sm font-medium">{product.name}</h3>
      <div className="flex items-center gap-2">
        <p className="font-semibold">
          {formatCurrency((product.price * (100 - product.discount)) / 100)}
        </p>
        {product.discount && (
          <p className="text-sm text-gray-500 line-through">
            ${formatCurrency(product.price)}
          </p>
        )}
      </div>
    </div>
  );
};
function RatingStars({ rating }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default ProductInfo;
