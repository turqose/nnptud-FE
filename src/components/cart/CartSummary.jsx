import { RadioGroup } from "@headlessui/react";
import formatCurrency from "../../utils/formatMoney";

export default function CartSummary({
  subtotal,
  shipping,
  total,
  shippingMethod,
  onShippingChange,
  onClick,
}) {
  const shippingOptions = [
    { id: "free", label: "Free shipping", price: 0 },
    { id: "express", label: "Express shipping", price: 15000.0 },
    { id: "pickup", label: "Pick Up", price: 21000.0 },
  ];

  return (
    <div className="rounded-lg bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold">Cart summary</h2>

      <div className="mt-4 space-y-2">
        <RadioGroup value={shippingMethod} onChange={onShippingChange}>
          <RadioGroup.Label className="sr-only">
            Shipping method
          </RadioGroup.Label>
          <div className="space-y-2">
            {shippingOptions.map((option) => (
              <RadioGroup.Option
                key={option.id}
                value={option.id}
                className={({ checked }) =>
                  `relative flex cursor-pointer rounded-lg border p-3 sm:p-4 focus:outline-none ${
                    checked ? "border-black" : "border-gray-200"
                  } hover:border-black`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-black" : "text-gray-900"
                            }`}
                          >
                            {option.label}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(option.price)}
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-sm sm:text-base">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between border-t pt-4 text-base font-semibold sm:text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={onClick}                  type="button"

        className="mt-6 w-full rounded-lg bg-black py-3 text-center text-sm font-semibold text-white hover:bg-gray-900"
      >
        Checkout
      </button>
    </div>
  );
}
