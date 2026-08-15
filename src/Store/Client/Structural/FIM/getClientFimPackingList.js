import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT FIM PACKING LIST ================= */
export const getClientFimPackingList = createAsyncThunk(
  "/party/getClientFimPackingList",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const projectId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const { page = 1, limit = 10, search = "" } = params;

      const myurl = `${V_URL}/party/fim/get-fim-packing-list`;

      const response = await axios.post(
        myurl,
        {
          project: projectId,
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
const getClientFimPackingListSlice = createSlice({
  name: "getClientFimPackingList",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientFimPackingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientFimPackingList.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientFimPackingList.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientFimPackingListSlice.reducer;
