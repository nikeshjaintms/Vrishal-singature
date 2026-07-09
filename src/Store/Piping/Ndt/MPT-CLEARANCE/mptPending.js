import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch RT Test Offer
export const getMultiMptPendingpiping = createAsyncThunk(
  "/user/piping/get-mpt-pending-offer",
  async ({ project_id, page, limit, search }, { rejectWithValue }) => {

    const payload = {
      project_id: project_id,
      page: page,
      limit: limit,
      search: search,
    }
    try {
      const response = await axios.post(
        `${V_URL}/user/piping/get-mpt-pending-offer`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        return response.data; // return full data (including pagination and data array)
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

const MPTPendingPipingSlice = createSlice({
  name: "MPTPending",
  initialState: {
    offers: [],        // store array of offer objects
    pagination: {},    // store pagination data
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiMptPendingpiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiMptPendingpiping.fulfilled, (state, action) => {
        state.offers = action.payload.data;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getMultiMptPendingpiping.rejected, (state, action) => {
        state.offers = [];
        state.pagination = {};
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default MPTPendingPipingSlice.reducer;
