import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getBlogs = createAsyncThunk(
  "blog/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBlog = createAsyncThunk(
  "blog/addBlog",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.post("/blogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/blogs/${data.id}`,
        data.formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllTags = createAsyncThunk(
  "blog/getAllTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/blogs/tags/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// recently added
export const getBlogRecentlyAdded = createAsyncThunk(
  "categoryBlog/getBlogRecentlyAdded",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/blogs/recent/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  blogs: [],
  blog: {},
  tags: [],
  loading: false,
  error: null,
  success: false,
  total: 0,
  pages: 0,
  blogRecentlyAdded: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBlogs.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.blogs = payload.data;
      state.error = null;
      state.total = payload.total;
      state.pages = payload.pages;
    });
    builder.addCase(getBlogs.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBlog.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.blogs.push(payload);
    });
    builder.addCase(addBlog.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBlog.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.blogs = state.blogs.map((blog) =>
        blog.id === payload.post_id ? payload : blog
      );
    });
    builder.addCase(updateBlog.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteBlog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBlog.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.blogs = state.blogs.filter((blog) => blog.post_id !== payload);
    });
    builder.addCase(deleteBlog.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(fetchBlogById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBlogById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.blog = payload;
    });
    builder.addCase(fetchBlogById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getAllTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllTags.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.tags = payload;
    });
    builder.addCase(getAllTags.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getBlogRecentlyAdded.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBlogRecentlyAdded.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.blogRecentlyAdded = payload;
    });
    builder.addCase(getBlogRecentlyAdded.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default blogSlice.reducer;
