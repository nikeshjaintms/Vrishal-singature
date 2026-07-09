import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
import { getMultiPacking } from "../MultiPacking/GetMultiPacking";

export const GetMultiGenStockReleaseNotePiping = createAsyncThunk(
  "/user/list-multi-stock-release-generate",
  async ({ page , limit, search } = {}) => {
    try {
      const baseUrl = `${V_URL}/user/piping/list-multi-stock-release-generate`;
      const Project = localStorage.getItem("U_PROJECT_ID");

      // Build dynamic query params
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      // if (limit !== null && limit !== undefined && limit !== "") queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);

      const finalUrl = `${baseUrl}?${queryParams.toString()}`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", Project);

      const response = await axios({
        method: "POST",
        url: finalUrl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response?.data;

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch release notes.");
      }
    } catch (error) {
      console.log("GetMultiGenReleaseNote error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);


const GetMultiGenStockReleaseNotePipingSlice = createSlice({
  name: "GetMultiGenStockReleaseNotePiping",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMultiGenStockReleaseNotePiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMultiGenStockReleaseNotePiping.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetMultiGenStockReleaseNotePiping.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetMultiGenStockReleaseNotePipingSlice.reducer;
