import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ============================
   ASYNC THUNK - GET DPT OFFER
============================ */
export const getPwhtOffer = createAsyncThunk(
  "dptOffer/getPwhtOffer",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${V_URL}/user/get-pwht-offer-piping`; // your API endpoint

     const response = await axios.post(
        url,
        {
          project_id: localStorage.getItem("U_PROJECT_ID"), // ✅ body
        },
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("PAY_USER_TOKEN"), // ✅ headers
          },
        }
      );


      if (response.data.success) {
        return response.data.data; // return array of offers
      } else {
        toast.error(response.data.message || "Failed to fetch DPT offers");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const getPwhtOfferSlice = createSlice({
  name: "getPwhtOffer",
  initialState: {
    data: [],        // array of DPT offers
    loading: false,  // loading state
    error: null,     // error message
  },
  reducers: {
    clearPwhtOffer: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPwhtOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPwhtOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPwhtOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPwhtOffer } = getPwhtOfferSlice.actions;

export default getPwhtOfferSlice.reducer;
