import { Grid, List } from "lucide-react"



export function ViewToggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("grid")}
        className={`rounded-lg p-2 ${
          value === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
        }`}
        aria-label="Grid view"
      >
        <Grid className="h-5 w-5" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`rounded-lg p-2 ${
          value === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
        }`}
        aria-label="List view"
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  )
}

