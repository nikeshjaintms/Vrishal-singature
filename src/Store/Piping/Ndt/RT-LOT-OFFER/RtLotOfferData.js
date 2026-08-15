import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch RT Test Offer
export const fetchRTLotOfferData = createAsyncThunk(
  "/user/piping/get-rt-lot-offer",
  async ({ project_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/piping/get-rt-lot-offer-data`,
        { project: project_id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // return only the array of offers
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.message);
    }
  }
);

const RTLotOfferSlice = createSlice({
  name: "RTLotOffer",
  initialState: {
    offers: [],        // store array of offer objects
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRTLotOfferData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRTLotOfferData.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.loading = false;
      })
      .addCase(fetchRTLotOfferData.rejected, (state, action) => {
        state.offers = [];
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default RTLotOfferSlice.reducer;