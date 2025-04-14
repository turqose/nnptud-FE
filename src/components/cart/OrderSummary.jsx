import formatCurrency from "../../utils/formatMoney";

export default function OrderSummary({ items, shippingMethod, shippingCost }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="text-lg font-medium">Order Summary</h2>

      <div className="mt-6 divide-y">
        {items.map((item) => (
          <div key={item.cart_item_id} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={
                  import.meta.env.VITE_API_URL +
                    "/" +
                    item.product.images[0].url || "/placeholder.svg"
                }
                crossOrigin="anonymous"
                alt={item.name}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border px-2 py-1">
                  <span className="text-sm">Qty: {item.quantity}</span>
                </div>
                <p className="font-medium">
                  {formatCurrency(
                    (item.product.price * (100 - item.product.discount)) / 100
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping ({shippingMethod})</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Coupon Input */}
      <div className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Input"
            className="flex-1 rounded-lg border px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
