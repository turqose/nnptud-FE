import React from "react";
import HoverAction from "./HoverAction";

const ProductImage = ({ product, view }) => {
  return (
    <div
      className={
        view === "list"
          ? "relative aspect-square w-40 shrink-0 overflow-hidden rounded-lg bg-gray-100"
          : "relative aspect-square overflow-hidden rounded-lg bg-gray-100"
      }
    >
      <img
        src={import.meta.env.VITE_API_URL +"/"+ product.images[0].url || "/placeholder.svg"}
        alt={product.name}
        crossOrigin="anonymous"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Badges */}
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        {product.isNew && (
          <div className="rounded bg-green-400 px-2 py-1 text-xs font-semibold text-white">
            NEW
          </div>
        )}
        {product.discount && (
          <div className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{product.discount}%
          </div>
        )}
      </div>
      <HoverAction />
    </div>
  );
};

export default ProductImage;
