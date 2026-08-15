import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserPaintSystem = createAsyncThunk(
  "/issue/getUserPaintSystem",
  async ({ status }) => {
    try {
      const Project = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-painting-system?status=${status}&project=${Project}`;
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      console.log(data, "getUserPaintSystem response");
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

const getUserPaintSystemSlice = createSlice({
  name: "getUserPaintSystem",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPaintSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPaintSystem.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserPaintSystem.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserPaintSystemSlice.reducer;
