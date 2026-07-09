import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getNDTPercentage = createAsyncThunk(
  "ndtPercentage/get",
  async (
    { page = 1, limit = 10, project, search } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${V_URL}/user/piping/get-ndt-percentage`,
        {
          params: {
            project: project || localStorage.getItem("U_PROJECT_ID"),
            page,
            limit,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
          },
        }
      );

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
const getNDTPercentageSlice = createSlice({
  name: "getNDTPercentage",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNDTPercentage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNDTPercentage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getNDTPercentage.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default getNDTPercentageSlice.reducer;
