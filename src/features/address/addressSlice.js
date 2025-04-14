import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getAddresses = createAsyncThunk(
  "address/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/address");
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchAddressById = createAsyncThunk(
  "address/fetchAddressById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/address/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/address", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/address/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/address/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/address/default/${data}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
  success: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAddresses.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.addresses = payload;
      state.error = null;
    });
    builder.addCase(getAddresses.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addAddress.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;

      state.success = true;
      state.addresses.push(payload);
    });
    builder.addCase(addAddress.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateAddress.pending, (state) => {
      state.loading = true;
      state.error = null;

    });
    builder.addCase(updateAddress.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;

      state.addresses = state.addresses.map((address) =>
        address.address_id === payload.address_id ? payload : address
      );
    });
    builder.addCase(updateAddress.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteAddress.pending, (state) => {
      state.loading = true;
      state.error = null;

    });
    builder.addCase(deleteAddress.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.addresses = state.addresses.filter(
        (address) => address.address_id !== payload
      );
    });
    builder.addCase(deleteAddress.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

 
export default addressSlice.reducer;