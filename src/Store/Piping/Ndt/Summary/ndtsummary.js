import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch NDT Summary Report
export const fetchNdtSummaryData = createAsyncThunk(
  "/user/piping/get-ndt-summary-report",
  async ({ project_id, currentPage, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/piping/get-ndt-summary-report`,
        {
          project: project_id,
          currentPage,
          limit,
          search
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        return response.data; // return full response to get pagination info
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.message);
    }
  }
);

const NdtSummarySlice = createSlice({
  name: "NdtSummary",
  initialState: {
    offers: [],        // store array of offer objects
    pagination: {
      totalRecords: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNdtSummaryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNdtSummaryData.fulfilled, (state, action) => {
        state.offers = action.payload.data;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchNdtSummaryData.rejected, (state, action) => {
        state.offers = [];
        state.pagination = {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 0
        };
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default NdtSummarySlice.reducer;
