// redux/slices/getFdDataFromNdtSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ============================
   ASYNC THUNK - GET FD OFFER DATA
============================ */
export const getFdDataFromNdt = createAsyncThunk(
  "fitup/getFdDataFromNdt",
  async ({ page, limit, search = "", project_id }, { rejectWithValue }) => {
    try {
      const url = `${V_URL}/user/piping-get-fd-offer-data-from-ndt`;

      const response = await axios.post(
        url,
        {page, limit, search, project_id}, // empty body
        {
          
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        console.log("response data in getFdDataFromNdt ", response.data.data);
        return response.data.data; // data + pagination
      } else {
        toast.error(response.data.message || "Failed to fetch data");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const getFdDataFromNdtSlice = createSlice({
  name: "getFdDataFromNdt",
  initialState: {
    data: [],        // array of {drawing_no, rev, sheet_no, spool_no, weldVisualData}
    pagination: {},  // { totalItems, currentPage, totalPages, limit }
    loading: false,
    error: null,
  },
  reducers: {
    clearFdData: (state) => {
      state.data = [];
      state.pagination = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFdDataFromNdt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFdDataFromNdt.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(getFdDataFromNdt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFdData } = getFdDataFromNdtSlice.actions;
export default getFdDataFromNdtSlice.reducer;
