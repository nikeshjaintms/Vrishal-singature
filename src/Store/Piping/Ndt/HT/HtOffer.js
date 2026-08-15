import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch FinalCoatShade list
export const getUserHt = createAsyncThunk(
  "/issue/getUserHt",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const project_id = localStorage.getItem("U_PROJECT_ID");
      const token = localStorage.getItem("PAY_USER_TOKEN");

      console.log("Fetching HT Offer list with:", { project_id, search, page, limit });

      const response = await axios.post(
        `${V_URL}/user/piping-list-multi-ht-offer`,
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
        throw new Error(response.data.message || "Failed to fetch HT Offer list");
      }
    } catch (error) {
      console.error("Error fetching FinalCoatShade list:", error);
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const getUserHtSlice = createSlice({
  name: "getUserHt",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserHt.pending, (state) => {
        console.log("Fetching HT Offer: pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserHt.fulfilled, (state, action) => {
        console.log("Fetching HT Offer: fulfilled", action.payload);
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(getUserHt.rejected, (state, action) => {
        console.error("Fetching HT Offer: rejected", action.payload, action.error);
        const errorMessage = action.payload?.message || action.error?.message || "Unknown error";

        state.user = null;
        state.loading = false;
        state.error = errorMessage;
      });
  },
});

export default getUserHtSlice.reducer;


