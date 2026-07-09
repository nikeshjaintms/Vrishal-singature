import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getOfferDataforStockPackaing = createAsyncThunk(
  '/package/getOfferDataforStockPackaing',
  async ({ page, limit, search }, thunkAPI) => {
    try {
      const token = localStorage.getItem('PAY_USER_TOKEN');
      const project = localStorage.getItem('U_PROJECT_ID');

      const response = await axios.post(
        `${V_URL}/user/piping/get-offer-multi-stock-packing`,
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


const getOfferDataforStockPackaingSlice = createSlice({
  name: "getOfferDataforStockPackaing",
  initialState: {
    issues: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOfferDataforStockPackaing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferDataforStockPackaing.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.issues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOfferDataforStockPackaing.rejected, (state, action) => {
        state.issues = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export default getOfferDataforStockPackaingSlice.reducer;
