import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ======================= API CALL ======================= */

export const getSpoolBreakUpSummary = createAsyncThunk(
  "/spoolBreakUp/getSpoolBreakUpSummary",
  async (params = {}, { rejectWithValue }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const { page, limit, search, packing_id } = params;

      /* ----------- QUERY PARAMS ----------- */

      const queryParams = new URLSearchParams();
      if (page != null) queryParams.append("page", page);
      if (limit != null) queryParams.append("limit", limit);
      if (search != null) queryParams.append("search", search);

      const url = `${V_URL}/user/get-spool-break-up-summary-piping?${queryParams.toString()}`;

      /* ----------- API CALL ----------- */

      const response = await axios({
        method: "post",
        url: url,
        data: {
          project_id: proId,
          packing_id: packing_id || null,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

      if (data.success === true) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      console.log(error, "error");

      toast.error(
        error.response?.data?.message || "Failed to fetch Spool BreakUp"
      );

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ======================= SLICE ======================= */

const getSpoolBreakUpSummarySlice = createSlice({
  name: "getSpoolBreakUpSummary",
  initialState: {
    user: null,        // full API response
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ----------- PENDING ----------- */
      .addCase(getSpoolBreakUpSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* ----------- SUCCESS ----------- */
      .addCase(getSpoolBreakUpSummary.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      /* ----------- ERROR ----------- */
      .addCase(getSpoolBreakUpSummary.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default getSpoolBreakUpSummarySlice.reducer;