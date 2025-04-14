import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatMoney";
import HoverAction from "./HoverAction";

export function ProductCard({
  name,
  price,
  originalPrice,
  images,

  isNew,
  discount,
  slug,
  totalRating,
}) {
  return (
    <Link to={`/shop/${slug}`} className="group relative">
      <div className="group relative">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={
              import.meta.env.VITE_API_URL + "/" + images[0]?.url ||
              "/placeholder.svg"
            }
            alt={name}
            crossOrigin="anonymous"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <div className="absolute left-4 top-4 rounded bg-green-400 px-2 py-1 text-xs font-semibold text-white">
              NEW
            </div>
          )}
          {discount && discount > 0 && (
            <div className="absolute left-4 top-4 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              -{discount}%
            </div>
          )}

          <HoverAction onClick={() => {}} />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < totalRating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h3 className="text-lg font-medium line-clamp-3 min-h-[4.5em]">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="font-semibold">
              {formatCurrency((price * (100 - discount)) / 100)}
            </p>
            {discount && discount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                {formatCurrency(price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Add the following CSS to your global stylesheet or a CSS module
// .line-clamp-3 {
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   height: 4.5em; /* Adjust based on line height to ensure 3 lines */
// }
