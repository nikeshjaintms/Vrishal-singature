import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getOfferDataforPackaing = createAsyncThunk(
  '/package/getOfferDataforPackaing',
  async ({ page, limit, search }, thunkAPI) => {
    try {
      const token = localStorage.getItem('PAY_USER_TOKEN');
      const project = localStorage.getItem('U_PROJECT_ID');

      const response = await axios.post(
        `${V_URL}/user/piping/get-offer-multi-packing`,
        {
          page, limit, search, project
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Request failed'
      );
    }
  }
);


const getOfferDataforPackaingSlice = createSlice({
  name: "getOfferDataforPackaing",
  initialState: {
    issues: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOfferDataforPackaing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferDataforPackaing.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.issues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOfferDataforPackaing.rejected, (state, action) => {
        state.issues = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export default getOfferDataforPackaingSlice.reducer;
