import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// Async thunk to fetch FinalCoatShade list
export const getUserFinalCoatShadeMaster = createAsyncThunk(
  "/issue/getUserFinalCoatShadeMaster",
  async ({ status = "all", page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const project = localStorage.getItem("U_PROJECT_ID");
      const token = localStorage.getItem("PAY_USER_TOKEN");

      console.log("Fetching Paint Requirement list with:", { project, search, page, limit });

      const response = await axios.post(
        `${V_URL}/user/get-all-final-coat-shade`,
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
        throw new Error(response.data.message || "Failed to fetch FinalCoatShade");
      }
    } catch (error) {
      console.error("Error fetching FinalCoatShade list:", error);
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const getUserFinalCoatShadeMasterSlice = createSlice({
  name: "getUserFinalCoatShadeMaster",
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
      .addCase(getUserFinalCoatShadeMaster.pending, (state) => {
        console.log("Fetching FinalCoatShades: pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFinalCoatShadeMaster.fulfilled, (state, action) => {
          console.log("Fetching FinalCoatShades: fulfilled", action.payload);
          const apiData = action.payload?.data || {}; // { data: [...], total, page, pages }
          const items = Array.isArray(apiData.data) ? apiData.data : [];


          state.data = items;
          state.total = apiData.total || 0; // use API total
          state.page = apiData.page || 1;
          state.pages = apiData.pages || 1;
          state.loading = false;
          state.error = null;
      })

      .addCase(getUserFinalCoatShadeMaster.rejected, (state, action) => {
        console.error("Fetching FinalCoatShades: rejected", action.payload, action.error);
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

export default getUserFinalCoatShadeMasterSlice.reducer;


