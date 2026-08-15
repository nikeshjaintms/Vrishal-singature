import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch FinalCoatShade list
export const getUserPmi = createAsyncThunk(
  "/issue/getUserPmi",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const project_id = localStorage.getItem("U_PROJECT_ID");
      const token = localStorage.getItem("PAY_USER_TOKEN");

      console.log("Fetching PMI Offer list with:", { project_id, search, page, limit });

      const response = await axios.post(
        `${V_URL}/user/piping-list-multi-pmi-offer`,
        { project_id, search, page, limit },
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
        throw new Error(response.data.message || "Failed to fetch PMI Offer list");
      }
    } catch (error) {
      console.error("Error fetching PMI Offer list:", error);
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const getUserPmiSlice = createSlice({
  name: "getUserPmi",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPmi.pending, (state) => {
        console.log("Fetching PMI Offer: pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPmi.fulfilled, (state, action) => {
        console.log("Fetching PMI Offer: fulfilled", action.payload);
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(getUserPmi.rejected, (state, action) => {
        console.error("Fetching PMI Offer: rejected", action.payload, action.error);
        const errorMessage = action.payload?.message || action.error?.message || "Unknown error";

        state.user = null;
        state.loading = false;
        state.error = errorMessage;
      });
  },
});

export default getUserPmiSlice.reducer;


