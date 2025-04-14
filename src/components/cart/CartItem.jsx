import formatCurrency from "../../utils/formatMoney";

export default function CartItems({ items, onUpdateQuantity, onRemove }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center sm:p-8">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      {/* Mobile View */}
      <div className="divide-y lg:hidden">
        {items.map((item) => (
          <div key={item.product_id} className="p-4 sm:p-6">
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-24">
                <img
                  src={
                    import.meta.env.VITE_API_URL +
                      "/" +
                      item.product.images[0].url || "/placeholder.svg"
                  }
                  alt={item.product.name}
                  crossOrigin="anonymous"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(
                      (item.product.price * (100 - item.product.discount)) / 100
                    )}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.cart_item_id, item.quantity - 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.cart_item_id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.cart_item_id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(
                      ((item.product.price * (100 - item.product.discount)) /
                        100) *
                        item.quantity
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="py-4 pl-8 text-left">Product</th>
              <th className="px-4 py-4 text-center">Quantity</th>
              <th className="px-4 py-4 text-right">Price</th>
              <th className="px-8 py-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.product_id}>
                <td className="py-4 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={
                          import.meta.env.VITE_API_URL +
                            "/" +
                            item.product.images[0].url || "/placeholder.svg"
                        }
                        alt={item.product.name}
                        crossOrigin="anonymous"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>

                      <button
                        onClick={() => onRemove(item.cart_item_id)}
                        className="mt-1 text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <div className="flex items-center rounded-lg border">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.cart_item_id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.cart_item_id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(
                    (item.product.price * (100 - item.product.discount)) / 100
                  )}
                </td>
                <td className="px-8 py-4 text-right">
                  {formatCurrency(
                    ((item.product.price * (100 - item.product.discount)) /
                      100) *
                      item.quantity
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
