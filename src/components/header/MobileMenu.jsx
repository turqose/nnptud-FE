import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Fragment } from "react"
import { Link } from "react-router-dom"

 
export function MobileMenu({ isOpen, onClose }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
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
          <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 py-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={onClose} className="p-2" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link to="/" className="block py-2 text-lg" onClick={onClose}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="block py-2 text-lg" onClick={onClose}>
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/product" className="block py-2 text-lg" onClick={onClose}>
                    Product
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block py-2 text-lg" onClick={onClose}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

