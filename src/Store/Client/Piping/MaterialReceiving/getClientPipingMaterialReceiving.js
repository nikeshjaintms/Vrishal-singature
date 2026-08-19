import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT PIPING MATERIAL RECEIVING / PURCHASE OFFER LIST ================= */
export const getClientPipingMaterialReceiving = createAsyncThunk(
  "getClientPipingMaterialReceiving",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const projectId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const { page = 1, limit = 10, search = "" } = params;

      const myurl = `${V_URL}/party/get-piping-purchase-offer-client?page=${page}&limit=${limit}&projectId=${projectId || ""}&search=${encodeURIComponent(search)}`;

      const response = await axios.post(
        myurl,
        {
          projectId: projectId || "",
          page,
          limit,
          search,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success === true || response?.status === 200) {
        return response.data;
      }

      return rejectWithValue(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch data"
      );

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= SLICE ================= */
const getClientPipingMaterialReceivingSlice = createSlice({
  name: "getClientPipingMaterialReceiving",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientPipingMaterialReceiving.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientPipingMaterialReceiving.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientPipingMaterialReceiving.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientPipingMaterialReceivingSlice.reducer;
