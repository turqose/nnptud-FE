import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (
    {
      page = 1,
      limit = 12,
      search = "",
      minPrice,
      maxPrice,
      categories,
      sortBy,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(`/products`, {
        params: {
          page,
          limit,
          search,
          minPrice,
          maxPrice,
          categorySlug: categories,
          sort: sortBy,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "product/fetchProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/slug/${slug}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data.formData.get("images")[0]);
      const response = await axiosInstance.put(
        `/products/${data.id}`,
        data.formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const filterProducts = createAsyncThunk(
  "product/filterProducts",
  async ({ category, priceRange }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products", {
        params: { category, priceRange },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const initialState = {
  products: [],
  product: {},
  relatedProducts: [],
  totalRating: 0,
  loading: false,
  error: null,
  success: false,
  total: 0,
  pages: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = payload.data;
      state.error = null;
      state.total = payload.total;
      state.pages = payload.pages;
    });
    builder.addCase(getProducts.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.products = state.products.filter(
        (product) => product.product_id !== payload
      );
    });
    builder.addCase(deleteProduct.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(filterProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(filterProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = payload.data;
      state.error = null;
      state.total = payload.total;
      state.pages = payload.pages;
    });
    builder
      .addCase(filterProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.product = payload.product;
        state.relatedProducts = payload.relatedProducts;
        state.totalRating = payload.totalRating;
        state.error = null;
      })
      .addCase(fetchProductBySlug.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default productSlice.reducer;
