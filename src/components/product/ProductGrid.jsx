import { useState } from "react";
import { Pagination } from "./pagination";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";

const ITEMS_PER_PAGE = 6;

export function ProductGrid({ view, products, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "divide-y"
        }
      >
        {currentProducts.map((product,index) => (
          <div
            key={index}
            className={
              view === "list"
                ? "flex gap-4 py-4 first:pt-0 last:pb-0"
                : "group relative"
            }
          >
            <ProductImage product={product} view={view} />
            <ProductInfo product={product} view={view} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
