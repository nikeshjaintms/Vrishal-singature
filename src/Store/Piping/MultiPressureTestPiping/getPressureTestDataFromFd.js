import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const getPressureTestDataFromFd = createAsyncThunk(
  "/party/getPressureTestDataFromFd",
  async (params = {}, { rejectWithValue }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const { page, limit , search } = params;

      // Build query string dynamically
      const queryParams = new URLSearchParams();
      if (page != null) queryParams.append("page", page);
      if (limit != null) queryParams.append("limit", limit);
       if (search != null) queryParams.append("search", search);
      queryParams.append("project", proId);

      const myurl = `${V_URL}/user/get-fd-data-in-pressure-test?${queryParams.toString()}`;

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

const getPressureTestDataFromFdSlice = createSlice({
    name: "getPressureTestDataFromFd",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPressureTestDataFromFd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPressureTestDataFromFd.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPressureTestDataFromFd.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPressureTestDataFromFdSlice.reducer;