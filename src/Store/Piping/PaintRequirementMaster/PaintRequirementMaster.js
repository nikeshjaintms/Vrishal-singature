import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// Async thunk to fetch PaintRequirement list
export const getUserPaintRequirementMaster = createAsyncThunk(
  "/issue/getUserPaintRequirementMaster",
  async ({ status = "all", page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const project = localStorage.getItem("U_PROJECT_ID");
      const token = localStorage.getItem("PAY_USER_TOKEN");

      console.log("Fetching Paint Requirement list with:", { project, search, page, limit });

      const response = await axios.post(
        `${V_URL}/user/get-all-paint-requirement`,
        { project, search, page, limit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        return response.data; // { data, total, page, pages }
      } else {
        throw new Error(response.data.message || "Failed to fetch PaintRequirement");
      }
    } catch (error) {
      console.error("Error fetching PaintRequirement list:", error);
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const getUserPaintRequirementMasterSlice = createSlice({
  name: "getUserPaintRequirementMaster",
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
      .addCase(getUserPaintRequirementMaster.pending, (state) => {
        console.log("Fetching PaintRequirements: pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPaintRequirementMaster.fulfilled, (state, action) => {
          console.log("Fetching PaintRequirements: fulfilled", action.payload);
          const apiData = action.payload?.data || {}; // { data: [...], total, page, pages }
          const items = Array.isArray(apiData.data) ? apiData.data : [];


          state.data = items;
          state.total = apiData.total || 0; // use API total
          state.page = apiData.page || 1;
          state.pages = apiData.pages || 1;
          state.loading = false;
          state.error = null;
      })

      .addCase(getUserPaintRequirementMaster.rejected, (state, action) => {
        console.error("Fetching PaintRequirements: rejected", action.payload, action.error);
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

export default getUserPaintRequirementMasterSlice.reducer;


