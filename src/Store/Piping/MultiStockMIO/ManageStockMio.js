import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const manageStockMioOffer = createAsyncThunk(
  "/user/manage-multi-stock-mio-offer",
  async ({ bodyFormData }) => {
    try {
      const myurl = `${V_URL}/user/manage-multi-stock-mio-offer`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      if (data.success === true) {
        return data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      return error;
    }
  }
);

export const manageStockMioOfferTable = createAsyncThunk(
  "/user/piping-manage-multi-stock-mio-offer",
  async ({ bodyFormData }) => {
    try {
      const myurl = `${V_URL}/user/piping-manage-multi-stock-mio-offer`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      if (data.success === true) {
        return data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      throw error;
    }
  }
);

const manageStockMioOfferSlice = createSlice({
  name: "manageStockMioOffer",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(manageStockMioOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageStockMioOffer.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(manageStockMioOffer.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(manageStockMioOfferTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageStockMioOfferTable.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(manageStockMioOfferTable.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default manageStockMioOfferSlice.reducer;
