import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

export const getAdminPUR = createAsyncThunk(
  "/admin/list-pur",
  async ({ formData }) => {
    try {
      const myurl = `${V_URL}/admin/list-pur`;

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

const getAdminPURSlice = createSlice({
  name: "getAdminPUR",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPUR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPUR.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminPUR.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminPURSlice.reducer;
