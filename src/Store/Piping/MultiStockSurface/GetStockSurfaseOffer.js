import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingMultiStockSurfaceOffer = createAsyncThunk(
  "/user/piping-get-multi-stock-surface",
  async (args = {}) => {
    try {
      const { page, limit, search, DATA, isMIO } = args;
      const myurl = `${V_URL}/user/piping-get-multi-stock-surface`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      // bodyFormData.append("is_accepted", 2);

      if (page) bodyFormData.append("page", page);
      if (limit) bodyFormData.append("limit", limit);
      if (search) bodyFormData.append("search", search);
      if (isMIO) bodyFormData.append("isMIO", isMIO);

      if (DATA) {
        if (DATA.report_no) bodyFormData.append("report_no", DATA.report_no);
        if (DATA.dispatch_site) bodyFormData.append("dispatch_site", DATA.dispatch_site);
        if (DATA.paint_system_id) bodyFormData.append("paint_system_id", DATA.paint_system_id);
      }

      const response = await axios({
        method: "POST",
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
        throw new Error(data.message || "API Error");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      throw error;
    }
  }
);

const getPipingMultiStockSurfaceOfferSlice = createSlice({
  name: "getPipingMultiStockSurface",
  initialState: {
    user: { data: [] }, // ✅ default empty array prevents undefined
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMultiStockSurfaceOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMultiStockSurfaceOffer.fulfilled, (state, action) => {
        state.user = action.payload; // full response
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMultiStockSurfaceOffer.rejected, (state, action) => {
        state.user = { data: [] }; // fallback empty array
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingMultiStockSurfaceOfferSlice.reducer;
