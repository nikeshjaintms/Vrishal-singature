import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
import Item from "../../../Pages/Piping/Item/Item";

// Async thunk to fetch Ndt list
export const getUserNdtMasterPiping = createAsyncThunk(
  "/issue/getUserNdtMasterPiping",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const project = localStorage.getItem("U_PROJECT_ID");
      const token = localStorage.getItem("PAY_USER_TOKEN");

      console.log("Fetching NDT list with:", { project, search, page, limit });

      const response = await axios.post(
        `${V_URL}/user/get-all-piping-ndt`,
        { project, search, page, limit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data; // { data, total, page, pages }
      } else {
        throw new Error(response.data.message || "Failed to fetch Ndt");
      }
    } catch (error) {
      console.error("Error fetching Ndt list:", error);
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const getUserNdtMasterPipingSlice = createSlice({
  name: "getUserNdtMasterPiping",
  initialState: {
    data: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNdtMasterPiping.pending, (state) => {
        console.log("Fetching Ndts: pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNdtMasterPiping.fulfilled, (state, action) => {
          const apiData = action.payload?.data || {};
          const items = Array.isArray(apiData.data) ? apiData.data : [];


          state.data = items;
          state.total = apiData.total || 0; // use API total
          state.page = apiData.page || 1;
          state.pages = apiData.pages || 1;
          state.loading = false;
          state.error = null;
      })

      .addCase(getUserNdtMasterPiping.rejected, (state, action) => {
        console.error("Fetching Ndts: rejected", action.payload, action.error);
        const errorMessage = action.payload?.message || action.error?.message || "Unknown error";

        state.data = [];
        state.total = 0;
        state.page = 1;
        state.pages = 1;
        state.loading = false;
        state.error = errorMessage;
      });
  },
});

export default getUserNdtMasterPipingSlice.reducer;


