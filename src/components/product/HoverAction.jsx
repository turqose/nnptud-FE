import React from "react";

const HoverAction = ({ onClick }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 gap-2 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
      <button 
      onClick={onClick}
      className="w-3/4 rounded-lg bg-black py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900">
        Add to cart
      </button>
    </div>
  );
};

export default HoverAction;
