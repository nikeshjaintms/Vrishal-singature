import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultipleIssueReturn = createAsyncThunk(
  '/issue/getMultipleIssueReturn',
  async ({ page, limit, search , project, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem('PAY_USER_TOKEN');
      // const project = localStorage.getItem('U_PROJECT_ID');

      const response = await axios.get(
        `${V_URL}/user/get-material-issue-return`,
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


const getMultipleIssueReturnSlice = createSlice({
  name: "getMultipleIssueReturn",
  initialState: {
    issues: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultipleIssueReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultipleIssueReturn.fulfilled, (state, action) => {
        state.issues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultipleIssueReturn.rejected, (state, action) => {
        state.issues = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export default getMultipleIssueReturnSlice.reducer;
