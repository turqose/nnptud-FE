import { Link } from "react-router-dom"

 
export default function BlogGrid({ posts, view }) {
  if (view === "grid") {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.post_id}
            to={`/blog/${post.post_id}`}
            className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={import.meta.env.VITE_API_URL + "/" + post.image || "/placeholder.svg"}
                alt={post.title}
                crossOrigin="anonymous"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="line-clamp-2 text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="group flex gap-6 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg sm:w-48">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{post.createdAt}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

