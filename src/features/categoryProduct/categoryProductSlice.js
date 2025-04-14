import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getCategoryProducts = createAsyncThunk(
  "categoryProduct/getCategoryProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/category-products",{
        params: { page, limit },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCategoryProductById = createAsyncThunk(
  "categoryProduct/fetchCategoryProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category-products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCategoryProduct = createAsyncThunk(
  "categoryProduct/addCategoryProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/category-products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategoryProduct = createAsyncThunk(
  "categoryProduct/updateCategoryProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/category-products/${data.id}`,
        data.formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategoryProduct = createAsyncThunk(
  "categoryProduct/deleteCategoryProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/category-products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  categoryProducts: [],
  loading: false,
  error: null,
  success: false,
  total: 0,
  pages : 0
};

const categoryProductSlice = createSlice({
  name: "categoryProduct",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategoryProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategoryProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.categoryProducts = payload.data;
      state.total = payload.total;
      state.pages = payload.pages;
      state.error = null;
    });
    builder.addCase(getCategoryProducts.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addCategoryProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCategoryProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categoryProducts.push(payload);
    });
    builder.addCase(addCategoryProduct.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateCategoryProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCategoryProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.categoryProducts = state.categoryProducts.map((categoryProduct) =>
        categoryProduct.category_id === payload.category_id
          ? payload
          : categoryProduct
      );
    });
    builder.addCase(updateCategoryProduct.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteCategoryProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCategoryProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categoryProducts = state.categoryProducts.filter(
        (categoryProduct) => categoryProduct.category_id !== payload
      );
    });
    builder.addCase(deleteCategoryProduct.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default categoryProductSlice.reducer;
