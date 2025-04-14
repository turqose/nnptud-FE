import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";
 
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/categories", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/categories/${data.id}`, data.formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
  success: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categories = payload;
      state.error = null;
    });
    builder.addCase(getCategories.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCategory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categories.push(payload);
    });
    builder.addCase(addCategory.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.categories = state.categories.map((category) =>
        category.id === payload.id ? payload : category
      );
    });
    builder.addCase(updateCategory.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categories = state.categories.filter(
        (category) => category.id !== payload
      );
    });
    builder.addCase(deleteCategory.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.categories = state.categories.map((category) =>
        category.id === payload.id ? payload : category
      );
    });
    builder.addCase(fetchCategoryById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default categorySlice.reducer;
