import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Fragment } from "react"

const priceRanges = [
  { label: "All Price", value: "all" },
  { label: "$0.00 - $99.99", value: "0-99.99" },
  { label: "$100.00 - $199.99", value: "100-199.99" },
  { label: "$200.00 - $299.99", value: "200-299.99" },
  { label: "$300.00 - $399.99", value: "300-399.99" },
  { label: "$400.00+", value: "400-plus" },
]

export function FilterSidebar({ isOpen, onClose, categories, loading, onCategoryChange, onPriceRangeChange }) {
  const handleCategoryChange = (category) => {
    onCategoryChange(category)
  }

  const handlePriceRangeChange = (priceRange) => {
    onPriceRangeChange(priceRange)
  }

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3 className="mb-4 font-semibold uppercase">Categories</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="category" className="rounded border-gray-300" onChange={() => handleCategoryChange(category.slug)} />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-sm text-gray-500">({category?.products?.length})</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 font-semibold uppercase">Price</h3>
        <ul className="space-y-2">
          {priceRanges.map((range) => (
            <li key={range.value}>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="price" value={range.value} className="rounded border-gray-300" onChange={() => handlePriceRangeChange(range.value)} />
                <span>{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  // Mobile dialog
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <FilterContent />
      </aside>

      {/* Mobile dialog */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={onClose} className="relative z-50 lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 py-6">
              <div className="mb-8 flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold">Filters</Dialog.Title>
                <button onClick={onClose} className="p-2" aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

