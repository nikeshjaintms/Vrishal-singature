import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const getMultiFitupPiping = createAsyncThunk(
  "/party/getMultiFitupPiping",
  async (params = {}, { rejectWithValue }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const { page, limit ,status, search } = params;

      // Build query string dynamically
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (page != null) queryParams.append("page", page);
      if (limit != null) queryParams.append("limit", limit);
       if (search != null) queryParams.append("search", search);
      queryParams.append("project", proId);

      const myurl = `${V_URL}/user/get-multi-fitup-piping?${queryParams.toString()}`;

      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

      if (data.success === true) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getMultiFitupPipingSlice = createSlice({
    name: "getMultiFitupPiping",
    initialState: {
       pendingList: null,
    completedList: null,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiFitupPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiFitupPiping.fulfilled, (state, action) => {
               state.user = action.payload; 
              const status = action.meta.arg.status;

if (String(status) === "1") {
    state.pendingList = action.payload;
  } else {
    state.completedList = action.payload;
  }
                // state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiFitupPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiFitupPipingSlice.reducer;