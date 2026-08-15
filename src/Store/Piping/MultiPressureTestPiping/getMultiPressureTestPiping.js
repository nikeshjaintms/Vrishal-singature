import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const getMultiPressureTestPiping = createAsyncThunk(
  "/party/getMultiPressureTestPiping",
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

      const myurl = `${V_URL}/user/get-fd-inspection-piping?${queryParams.toString()}`;

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

const getMultiPressureTestPipingSlice = createSlice({
    name: "getMultiPressureTestPiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiPressureTestPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiPressureTestPiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiPressureTestPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiPressureTestPipingSlice.reducer;