import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

export const getAdminPMSStock = createAsyncThunk(
  "/admin/get-stock-list",
  async () => {
    try {
      const myurl = `${V_URL}/admin/get-stock-list`;
      const response = await axios({
        method: "GET",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      });
      const data = response.data;
      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      return error;
    }
  }
);

const getAdminPMSStockSlice = createSlice({
  name: "getAdminPMSStock",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminPMSStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminPMSStock.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminPMSStock.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminPMSStockSlice.reducer;
