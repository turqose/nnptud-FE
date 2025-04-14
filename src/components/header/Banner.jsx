
import { X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export function Banner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-black text-white py-2 text-center text-sm">
      <div className="container flex items-center justify-center gap-2">
        <span>30% off storewide — Limited time!</span>
        <Link to="/shop" className="text-white hover:text-gray-200">
          Shop Now →
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close banner</span>
      </button>
    </div>
  )
}

