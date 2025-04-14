import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders`, {
        params: { page, limit },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/orders", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.put(
        `/orders/admin/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllOrdersByAdmin = createAsyncThunk(
  "order/getAllOrdersByAdmin",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/admin/all`, {
        params: { page, limit },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  order: {},
  loading: false,
  error: null,
  success: false,
  ordersByAdmin: [],
  total: 0,
  pages: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = payload.data;
      state.total = payload.total;
      state.pages = payload.pages;
      state.error = null;
    });
    builder.addCase(getOrders.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.orders.push(payload);
    });
    builder.addCase(addOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.orders = state.orders.map((order) =>
        order.order_id === payload.order_id ? payload : order
      );
    });
    builder.addCase(updateOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.orders = state.orders.filter((order) => order.order_id !== payload);
    });
    builder.addCase(deleteOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getAllOrdersByAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllOrdersByAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.ordersByAdmin = payload.data;
      state.total = payload.total;
      state.pages = payload.pages;
      state.error = null;
    });
    builder.addCase(getAllOrdersByAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.order = payload;
      state.error = null;
    });
    builder.addCase(fetchOrderById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default orderSlice.reducer;
