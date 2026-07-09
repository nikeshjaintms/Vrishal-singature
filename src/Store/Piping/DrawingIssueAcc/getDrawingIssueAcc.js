import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// Async thunk for fetching piping drawing IDs
export const fetchPipingIssueDrawingIds = createAsyncThunk(
  'piping/fetchIssueDrawingIds',
  async ({ project_id, page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${V_URL}/user/piping-drawing-ids`, {
        project: project_id,
        page,
        limit,
        search
      });
      console.log("API Response:", response.data);
      return response.data; // Assuming your API returns { success, data, totalValue }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching data');
    }
  }
);

const pipingIssueDrawingIdSlice = createSlice({
  name: 'pipingIssueDrawingId',
  initialState: {
    drawingIds: [], // <-- holds array of drawings
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipingIssueDrawingIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipingIssueDrawingIds.fulfilled, (state, action) => {
        state.loading = false;
        state.drawingIds = action.payload; // <-- array from API
      })
      .addCase(fetchPipingIssueDrawingIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default pipingIssueDrawingIdSlice.reducer;
