import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

export const getContacts = createAsyncThunk(
  "contact/getContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/contacts");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchContactById = createAsyncThunk(
  "contact/fetchContactById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addContact = createAsyncThunk(
  "contact/addContact",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/contacts", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/contacts/${data.id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  contacts: [],
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getContacts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contacts = payload.data;
      state.error = null;
    });
    builder.addCase(getContacts.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(addContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addContact.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.contacts.push(payload);
    });
    builder.addCase(addContact.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateContact.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.contacts = state.contacts.map((contact) =>
        contact.id === payload.id ? payload : contact
      );
    });
    builder.addCase(updateContact.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteContact.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.contacts = state.contacts.filter(
        (contact) => contact.id !== payload
      );
    });
    builder.addCase(deleteContact.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export default contactSlice.reducer;
