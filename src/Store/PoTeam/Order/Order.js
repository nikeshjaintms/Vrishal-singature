import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET ALL ORDERS ----------
export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async ({ project, search = "", page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/order/get-all-order`,
        { project, search, page, limit },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching orders");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- GET ORDER BY ID ----------
export const getOrderById = createAsyncThunk(
  "order/getById",
  async (payload, { rejectWithValue }) => {
    try {
      const id = payload.id;
      const response = await axios.post(
        `${V_URL}/user/order/get-order-by-id`,
        { id },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching order");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- SLICE ----------
const orderSlice = createSlice({
  name: "order",
  initialState: {
    list: { total: 0, page: 1, limit: 10, data: [] },
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })

      // GET Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.single = null;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
