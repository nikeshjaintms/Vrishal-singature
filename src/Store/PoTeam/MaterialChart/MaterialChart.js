import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET ALL MATERIAL CHART ----------

export const getAllMaterialChart = createAsyncThunk(
  "materialChart/getAll",
  async ({ projectId, search = "", page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/material-chart`,
        { projectId, search, page, limit },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching material chart");
      return rejectWithValue(err.message);
    }
  }
);


// ---------- SLICE ----------

const materialChartSlice = createSlice({
  name: "materialChart",
  initialState: {
    list: { total: 0, page: 1, limit: 10, data: [] },
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL MATERIAL CHART
      .addCase(getAllMaterialChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMaterialChart.fulfilled, (state, action) => {
        state.list = {
          data: action.payload.data,
          total: action.payload.total,
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
        };
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllMaterialChart.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default materialChartSlice.reducer;
