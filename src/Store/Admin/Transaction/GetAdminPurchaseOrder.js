import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getAdminPO = createAsyncThunk(
  "/admin/list-po",
  async ({ formData }) => {
    try {
      const myurl = `${V_URL}/admin/list-po`;

      const response = await axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      });

      const data = response.data;
      console.log(data, "getPurchaseRequest response");

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

const getAdminPOSlice = createSlice({
  name: "getAdminPO",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPO.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminPO.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminPOSlice.reducer;
