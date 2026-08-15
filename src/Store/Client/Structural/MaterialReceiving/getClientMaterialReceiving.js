import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT MATERIAL RECEIVING ================= */
export const getClientMaterialReceiving = createAsyncThunk(
  "/party/getClientMaterialReceiving",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const projectId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const { page = 1, limit = 10, search = "" } = params;
      const myurl = `${V_URL}/party/get-purchase-offer?page=${page}&limit=${limit}&projectId=${projectId}&search=${search}`;

      const response = await axios({
        method: "post",
        url: myurl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + token,
        },
      });

      if (response?.data?.success === true) {
        return response.data;
      }

      return rejectWithValue(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch data");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ================= SLICE ================= */
const getClientMaterialReceivingSlice = createSlice({
  name: "getClientMaterialReceiving",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientMaterialReceiving.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientMaterialReceiving.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientMaterialReceiving.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientMaterialReceivingSlice.reducer;
