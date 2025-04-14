import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosConfig";

export const addToCart = createAsyncThunk(
  "auth/addToCart",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/cart/add", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "auth/removeFromCart",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cart/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCart = createAsyncThunk(
  "auth/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/cart");
      return response.data;
    } catch (error) {
      if (error.response.status === 402) {
        return rejectWithValue(error.response.data);
      }
      toast.error(
        error.response.status === 429 
          ? "Too many requests. Please try again later."
          : error.response.data.message
      );
     

      return rejectWithValue(error.response.data);
    }
  }
);

 

export const updateCart = createAsyncThunk(
  "auth/updateCart",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/cart/items/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  carts: [],
  cartItems: [],
  loadingCart: false,
  error: null,
  flyingItem: null, // Thông tin item đang bay

};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.carts = [];
      state.cartItems = [];
      state.loadingCart = false;
      state.error = null;
    },
    setFlyingItem: (state, action) => {
      state.flyingItem = action.payload;
    },
    clearFlyingItem: (state) => {
      state.flyingItem = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.loadingCart = true;
    });
    builder.addCase(addToCart.fulfilled, (state, { payload }) => {
      state.loadingCart = false;
      state.carts = payload;
      state.error = null;
    });
    builder.addCase(addToCart.rejected, (state, { payload }) => {
      state.loadingCart = false;
      state.error = payload;
    });
    builder.addCase(removeFromCart.pending, (state) => {
      state.loadingCart = true;
    });
    builder.addCase(removeFromCart.fulfilled, (state, { payload }) => {
      state.loadingCart = false;
      state.cartItems = state.cartItems.filter(
        (item) => item.cart_item_id !== payload
      );
      state.error = null;
    });
    builder.addCase(removeFromCart.rejected, (state, { payload }) => {
      state.loadingCart = false;
      state.error = payload;
    });
    builder.addCase(getCart.pending, (state) => {
      state.loadingCart = true;
    });
    builder.addCase(getCart.fulfilled, (state, { payload }) => {
      state.loadingCart = false;
      state.carts = payload;
      state.cartItems = payload.items;
      state.error = null;
    });
    builder.addCase(getCart.rejected, (state, { payload }) => {
      state.loadingCart = false;
      state.error = payload;
    });
    
    builder.addCase(updateCart.pending, (state) => {
      state.loadingCart = true;
    });
    builder.addCase(updateCart.fulfilled, (state, { payload }) => {
      state.loadingCart = false;
      state.cartItems = state.cartItems.map((item) =>
        item.cart_item_id === payload.cart_item_id ? payload : item
      );
      state.error = null;
    });
    builder.addCase(updateCart.rejected, (state, { payload }) => {
      state.loadingCart = false;
      state.error = payload;
    });
  },
});

export const { clearCartState,setFlyingItem, clearFlyingItem } = cartSlice.actions;
export default cartSlice.reducer;
