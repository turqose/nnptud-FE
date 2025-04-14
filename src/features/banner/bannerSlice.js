import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getBanners = createAsyncThunk(
  "banner/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/banners");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBannerById = createAsyncThunk(
  "banner/getBannerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/banners/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBanner = createAsyncThunk(
  "banner/addBanner",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/banners", formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/banners/${id}`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/banners/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  banners: [],
  banner: {},
  loading: false,
  error: null,
  total: 0,
  pages: 0,
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(getBanners.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBanners.fulfilled, (state, action) => {
      state.loading = false;
      state.banners = action.payload.data;
      state.total = action.payload.total;
      state.pages = action.payload.pages
    });
    builder.addCase(getBanners.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchBannerById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBannerById.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
  
    });
    builder.addCase(fetchBannerById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(addBanner.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banners.unshift(action.payload);
    });
    builder.addCase(addBanner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateBanner.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.loading = false;
      
    });
    builder.addCase(updateBanner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteBanner.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banners = state.banners.filter(
        (banner) => banner.banner_id !== action.payload
      );
    });
    builder.addCase(deleteBanner.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default bannerSlice.reducer;
