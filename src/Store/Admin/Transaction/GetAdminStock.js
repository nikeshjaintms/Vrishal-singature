import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

export const getAdminMainStock = createAsyncThunk(
  "/admin/ms-stock",
  async (bodyFormData) => {
    try {
      const myurl = `${V_URL}/admin/ms-stock`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
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

const getAdminMainStockSlice = createSlice({
  name: "getAdminMainStock",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminMainStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminMainStock.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminMainStock.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminMainStockSlice.reducer;
