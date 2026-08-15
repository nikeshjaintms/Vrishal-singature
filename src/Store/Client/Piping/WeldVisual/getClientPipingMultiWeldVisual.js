import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getClientPipingMultiWeldVisual = createAsyncThunk(
  "getClientPipingMultiWeldVisual",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${V_URL}/party/get-piping-weld-visual-client`, {
        params: {
          project: localStorage.getItem("PARTY_PROJECT_ID"),
          status: "2,3,4",
          page,
          limit,
          search,
          _t: Date.now()
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
        },
      });

      if (response.data.success) {
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to fetch Weld Visual data");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching Weld Visual data");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getClientPipingMultiWeldVisualSlice = createSlice({
  name: "getClientPipingMultiWeldVisual",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientPipingMultiWeldVisual.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientPipingMultiWeldVisual.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getClientPipingMultiWeldVisual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getClientPipingMultiWeldVisualSlice.reducer;
