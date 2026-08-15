import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultipleIssueReturnPiping = createAsyncThunk(
  '/issue/getMultipleIssueReturnPiping',
  async ({ page, limit, search , project, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('PAY_USER_TOKEN');
      // const project = localStorage.getItem('U_PROJECT_ID');

      const response = await axios.get(
        `${V_URL}/user/get-material-issue-return-piping`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit, search, project, status },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Return failed'
      );
    }
  }
);


const getMultipleIssueReturnPipingSlice = createSlice({
  name: "getMultipleIssueReturnPiping",
  initialState: {
    issues: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultipleIssueReturnPiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultipleIssueReturnPiping.fulfilled, (state, action) => {
        state.issues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultipleIssueReturnPiping.rejected, (state, action) => {
        state.issues = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export default getMultipleIssueReturnPipingSlice.reducer;
