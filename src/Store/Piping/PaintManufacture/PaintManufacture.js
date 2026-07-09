import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserPaintManufacturePiping = createAsyncThunk(
  "/issue/getUserPaintManufacturePiping",
  async ({ status }) => {
    try {
      const Project = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-paint-manufacturer-piping?status=${status}&project=${Project}`;
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getUserPaintManufacture response");
      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getUserPaintManufacturePipingSlice = createSlice({
  name: "getUserPaintManufacturePiping",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPaintManufacturePiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPaintManufacturePiping.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserPaintManufacturePiping.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserPaintManufacturePipingSlice.reducer;
