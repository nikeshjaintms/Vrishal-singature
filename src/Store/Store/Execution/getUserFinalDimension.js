import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserFinalDimension = createAsyncThunk(
  "/issue/getUserFinalDimension",
  async ({ status , page, limit }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-multi-fd?project=${proId}&page=${page}&limit=${limit}`;
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getUserFinalDimension response");
      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getUserFinalDimensionSlice = createSlice({
  name: "getUserFinalDimension",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserFinalDimension.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFinalDimension.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserFinalDimension.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserFinalDimensionSlice.reducer;
