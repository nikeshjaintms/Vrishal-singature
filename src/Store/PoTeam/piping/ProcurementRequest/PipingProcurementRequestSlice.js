import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// ---------- GET ALL PROCUREMENT REQUESTS ----------
export const getAllProcurementRequests = createAsyncThunk(
  "pipingProcurementRequest/getAll",
  async ({ search = "", page, limit, status }, { rejectWithValue }) => {
    try {
      let project = localStorage.getItem("U_PROJECT_ID");
      const response = await axios.post(
        `${V_URL}/user/pr/get-all-procurement-request-piping`,
        { project, search, page, limit, status },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching PRs");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- GET PROCUREMENT REQUEST BY ID ----------
export const getProcurementRequestById = createAsyncThunk(
  "pipingProcurementRequest/getById",
  async (payload, { rejectWithValue }) => {
    try {
      const id = payload.id;
      const response = await axios.post(
        `${V_URL}/user/pr/get-procurement-request-by-id-piping`,
        { id },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        console.warn("Failed to fetch PR:", response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching PR by ID:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error fetching PR");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- SLICE ----------
const pipingProcurementRequestSlice = createSlice({
  name: "pipingProcurementRequest",
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
      .addCase(getAllProcurementRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProcurementRequests.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllProcurementRequests.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getProcurementRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProcurementRequestById.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProcurementRequestById.rejected, (state, action) => {
        state.single = null;
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default pipingProcurementRequestSlice.reducer;
