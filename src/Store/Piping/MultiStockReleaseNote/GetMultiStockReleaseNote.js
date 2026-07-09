import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const GetMultiStockReleaseNotePiping = createAsyncThunk(
  "/party/GetMultiStockReleaseNotePiping",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const baseUrl = `${V_URL}/user/piping/get-multi-stock-release-note`;
      const project_id = localStorage.getItem("U_PROJECT_ID");

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);

      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await axios.post(
        url,
        { project_id }, // ✅ JSON body (recommended)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
          },
        }
      );

      console.log("response",response)

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to fetch release notes");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const GetMultiStockReleaseNoteSlicePiping = createSlice({
  name: "GetMultiStockReleaseNotePiping",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMultiStockReleaseNotePiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMultiStockReleaseNotePiping.fulfilled, (state, action) => {
        console.log("action",action)
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(GetMultiStockReleaseNotePiping.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default GetMultiStockReleaseNoteSlicePiping.reducer;
