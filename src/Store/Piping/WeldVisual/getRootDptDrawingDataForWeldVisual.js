
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ============================
   ASYNC THUNK - GET DRAWING & SPOOL
============================ */
export const getRootDptDrawingDataForWeldVisual = createAsyncThunk(
  "fitup/getRootDptDrawingDataForWeldVisual",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${V_URL}/user/get-root-dpt-drawing-data-for-weld-visual-piping`; // your API endpoint

      const response = await axios.get(url, {
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
const getRootDptDrawingDataForWeldVisualSlice = createSlice({
  name: "getRootDptDrawingDataForWeldVisual",
  initialState: {
    data: [],        // array of {drawing_no, rev_no, sheet_no, spool_no}
    loading: false,  // loading state
    error: null,     // error message
  },
  reducers: {
    clearRootDptDrawingDataForWeldVisual: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRootDptDrawingDataForWeldVisual.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRootDptDrawingDataForWeldVisual.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getRootDptDrawingDataForWeldVisual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRootDptDrawingDataForWeldVisualSlice } = getRootDptDrawingDataForWeldVisualSlice.actions;

export default getRootDptDrawingDataForWeldVisualSlice.reducer;
