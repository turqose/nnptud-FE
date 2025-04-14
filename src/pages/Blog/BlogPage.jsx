import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllTags,
  getBlogRecentlyAdded,
  getBlogs,
} from "../../features/blogs/blogSlice";
import { getCategoryBlogs } from "../../features/categoryBlog/categoryBlogSlice";
import formatDate from "../../utils/formatDate";

const BlogPage = () => {
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const dispatch = useDispatch();
  const { categoryBlogs } = useSelector((state) => state.blogCategories);
  const { blogs, loading, error, blogRecentlyAdded, tags } = useSelector(
    (state) => state.blogPosts
  );

  useEffect(() => {
    dispatch(getBlogRecentlyAdded());
    dispatch(getBlogs());
    dispatch(getAllTags());
    dispatch(
      getCategoryBlogs({
        limit: 1000,
        page: 1,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        const sidebarTop = sidebar.getBoundingClientRect().top;
        setIsSidebarSticky(sidebarTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filter
            </button>
            <button
              onClick={toggleViewMode}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              {viewMode === "grid" ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              )}
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500">Sort by:</span>
            <select className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Latest</option>
              <option>Oldest</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-gray-500">
          {blogs ? `${blogs.length} Results Found` : "Loading..."}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div id="sidebar" className="lg:col-span-1">
          <div
            className={`space-y-8 ${
              isSidebarSticky ? "lg:sticky lg:top-4" : ""
            }`}
          >
            {/* Search */}
            <div>
              <input
                type="search"
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-xl font-bold mb-4">Top Categories</h2>
              <div className="space-y-2">
                {categoryBlogs &&
                  categoryBlogs.map((category) => (
                    <div
                      key={category.name}
                      className="flex justify-between items-center"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-500">
                        ({category.posts.length})
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-xl font-bold mb-4">Popular Tag</h2>
              <div className="flex flex-wrap gap-2">
                {tags &&
                  tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm rounded-full cursor-pointer
                    ${
                      tag === "Low fat"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recently Added</h2>
              <div className="space-y-4">
                {blogRecentlyAdded &&
                  blogRecentlyAdded.map((post, i) => (
                    <div key={i} className="flex gap-4">
                      <img
                        src={
                          import.meta.env.VITE_API_URL + "/" + post.image ||
                          "/placeholder.svg"
                        }
                        alt={post.title}
                        width={80}
                        height={80}
                        crossOrigin="anonymous"
                        className="rounded-lg"
                      />
                      <div>
                        <Link
                          to={`/blog/${post.post_id}`}
                          className="font-medium hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {blogs &&
              blogs.map((post, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div
                    className={`relative ${viewMode === "list" ? "w-1/3" : ""}`}
                  >
                    <img
                      src={
                        import.meta.env.VITE_API_URL + "/" + post.image ||
                        "/placeholder.svg"
                      }
                      crossOrigin="anonymous"
                      alt="Blog post image"
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 text-center">
                      <div className="font-bold">
                        {new Date(post.createdAt).getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt)
                          .toLocaleString("default", {
                            month: "short",
                          })
                          .toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className={`p-6 ${viewMode === "list" ? "w-2/3" : ""}`}>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{post.category.name}</span>
                      <span>{post.User.full_name}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3">{post.title}</h3>
                    {viewMode === "list" && (
                      <div
                        className="space-y-12"
                        dangerouslySetInnerHTML={{
                          __html: post.content.substring(0, 150),
                        }}
                      ></div>
                    )}
                    <Link
                      to={`/blog/${post.post_id}`}
                      className="text-green-500 hover:text-green-600 transition-colors inline-flex items-center gap-2"
                    >
                      Read More
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
