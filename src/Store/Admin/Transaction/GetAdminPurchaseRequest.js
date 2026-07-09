import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getAdminPR = createAsyncThunk(
  "/admin/list-pr",
  async ({ formData }) => {
    try {
      const myurl = `${V_URL}/admin/list-pr-admin`;

      const response = await axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getPurchaseRequest response");

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      // toast.error(error.response.data.message);
      return error;
    }
  }
);

const getAdminPRSlice = createSlice({
  name: "getAdminPR",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPR.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminPR.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminPRSlice.reducer;
