import { Minus, Plus, X } from "lucide-react";
import formatCurrency from "../../utils/formatMoney";

export function CartItemCard({ item, onUpdateQuantity, onRemove }) {
  console.log(item);
  return (
    <div className="flex gap-4 py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            import.meta.env.VITE_API_URL + "/" + item.product.images[0].url ||
            "/placeholder.svg"
          }
          alt={item.product.name}
          width={96}
          height={96}
          crossOrigin="anonymous"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{item.product.name}</h3>
          <button
            onClick={() => onRemove(item.cart_item_id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() =>
                onUpdateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))
              }
              className="p-2 text-gray-600 hover:text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-1 text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.cart_item_id, item.quantity + 1)}
              className="p-2 text-gray-600 hover:text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
