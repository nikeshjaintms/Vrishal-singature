import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getStockIssueRequestPiping = createAsyncThunk(
  '/issue/getStockIssueRequestPiping',
  async ({ page, limit, search , project, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('PAY_USER_TOKEN');
      // const project = localStorage.getItem('U_PROJECT_ID');

      const response = await axios.get(
        `${V_URL}/user/get-multi-stock-issue-request-piping`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit, search, project, status },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Request failed'
      );
    }
  }
);


const getStockIssueRequestPipingSlice = createSlice({
  name: "getStockIssueRequestPipingSlice",
  initialState: {
    issues: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStockIssueRequestPiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockIssueRequestPiping.fulfilled, (state, action) => {
        state.issues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getStockIssueRequestPiping.rejected, (state, action) => {
        state.issues = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export default getStockIssueRequestPipingSlice.reducer;
