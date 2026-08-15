import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET ALL INQUIRIES ----------
export const getAllInquiries = createAsyncThunk(
  "inquiry/getAll",
  async ({ project, search = "", page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/inquiry/get-all-inquiry`,
        { project, search, page, limit },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching inquiries");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- GET INQUIRY BY ID ----------
export const getInquiryById = createAsyncThunk(
  "inquiry/getById",
  async (payload, { rejectWithValue }) => {
    try {
      const id = payload.id;
      const response = await axios.post(
        `${V_URL}/user/inquiry/get-inquiry-by-id`,
        { id },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        console.warn("Failed to fetch inquiry:", response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching inquiry by ID:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error fetching inquiry");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- SLICE ----------
const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    list: { total: 0, page: 1, limit: 10, data: [] },
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInquiries.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllInquiries.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getInquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInquiryById.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getInquiryById.rejected, (state, action) => {
        state.single = null;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default inquirySlice.reducer;
