import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserPaintManufacture = createAsyncThunk(
  "/issue/getUserPaintManufacture",
  async ({ status }) => {
    try {
      const Project = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-paint-manufacturer?status=${status}&project=${Project}`;
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

const getUserPaintManufactureSlice = createSlice({
  name: "getUserPaintManufacture",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPaintManufacture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPaintManufacture.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserPaintManufacture.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserPaintManufactureSlice.reducer;
