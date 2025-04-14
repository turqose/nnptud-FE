import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchBlogById, getAllTags, getBlogRecentlyAdded } from "../../features/blogs/blogSlice";
import { getCategoryBlogs } from "../../features/categoryBlog/categoryBlogSlice";
import formatDate from "../../utils/formatDate";

const SingleBlogPage = () => {
  const { id } = useParams();
  const { blog, tags, blogRecentlyAdded } = useSelector(
    (state) => state.blogPosts
  );
  const { categoryBlogs } = useSelector((state) => state.blogCategories);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogRecentlyAdded());
    dispatch(getCategoryBlogs({ limit: 1000, page: 1 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);
  useEffect(() => {
    dispatch(getAllTags());
  }, [dispatch]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <article className=" container mx-auto px-4 md:py-4">
      {blog.image && (
        <>
          <div className="container mx-auto px-4  ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <img
                    src={import.meta.env.VITE_API_URL + "/" + blog.image}
                    crossOrigin="anonymous"
                    width={800}
                    height={500}
                    className="rounded-lg w-full"
                  />

                  <h1 className="text-3xl font-bold">{blog.title}</h1>

                  <div className="flex items-center gap-4">
                    <img
                      src="/user.jpg"
                      alt="Cameron Williamson"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{blog.User.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div
                      className="space-y-2"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Search */}
                <div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Top Categories</h2>
                  <div className="space-y-2">
                    {categoryBlogs &&
                      categoryBlogs.map((category, i) => (
                        <div
                          key={i}
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
                      blog.tags.includes(tag)
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
                            src={import.meta.env.VITE_API_URL + "/" + post.image}
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
                            <p className="text-sm text-gray-500">{post.createdAt}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
};

export default SingleBlogPage;
