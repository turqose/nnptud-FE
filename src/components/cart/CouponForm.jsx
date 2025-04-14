export default function CouponForm() {
    const handleSubmit = (e) => {
      e.preventDefault()
      // Handle coupon submission
      alert("Applying coupon...")
    }
  
    return (
      <div className="rounded-lg bg-white p-4 sm:p-6">
        <h3 className="font-medium">Have a coupon?</h3>
        <p className="mt-1 text-sm text-gray-500">Add your code for an instant cart discount</p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-1 rounded-lg border px-4 py-2 focus:border-gray-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg border px-6 py-2 font-medium hover:bg-gray-50">
            Apply
          </button>
        </form>
      </div>
    )
  }
  
  