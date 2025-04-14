
export function SortSelect({ value, onChange }) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border bg-white px-4 py-2">
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    )
  }
  