import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getClientMultiFd = createAsyncThunk(
  "/party/getClientMultiFd",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const proId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const myurl = `${V_URL}/party/get-multi-fd-view`;

      const response = await axios.get(myurl, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          project: proId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const getClientMultiFdSlice = createSlice({
  name: "getClientMultiFd",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientMultiFd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientMultiFd.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientMultiFd.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientMultiFdSlice.reducer;
