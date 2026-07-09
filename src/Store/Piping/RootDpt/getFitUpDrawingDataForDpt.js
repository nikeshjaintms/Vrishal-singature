
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ============================
   ASYNC THUNK - GET DRAWING & SPOOL
============================ */
export const getFitUpDrawingDataForDpt = createAsyncThunk(
  "fitup/getFitUpDrawingDataForDpt",
  async ({ page, limit, search = "" }, { rejectWithValue }) => {
    try {
      const url = `${V_URL}/user/get-fit-up-drawing-data-for-dpt-piping`; // your API endpoint

      const response = await axios.get(url, {
        params: { page, limit, search, project_id: localStorage.getItem('U_PROJECT_ID') },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      if (response.data.success) {
        return response.data.data; // return array of drawing-spool
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
const getFitUpDrawingDataForDptSlice = createSlice({
  name: "getFitUpDrawingDataForDpt",
  initialState: {
    data: [],        // array of {drawing_no, rev_no, sheet_no, spool_no}
    loading: false,  // loading state
    error: null,     // error message
  },
  reducers: {
    clearFitUpDrawingDataForDpt: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFitUpDrawingDataForDpt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFitUpDrawingDataForDpt.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getFitUpDrawingDataForDpt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFitUpDrawingDataForDptSlice } = getFitUpDrawingDataForDptSlice.actions;

export default getFitUpDrawingDataForDptSlice.reducer;
