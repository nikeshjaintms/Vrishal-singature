import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import toast from "react-hot-toast";

export const getPipingMultiSurface = createAsyncThunk(
  "piping/getPipingMultiSurface",
  async ({ report_no, main_id }, { rejectWithValue }) => {
    try {
      console.log('report_no', report_no);
      console.log('main_id', main_id);
      const myurl = `${V_URL}/user/piping-list-multi-surface-offer`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("report_no", report_no);
      bodyFormData.append("main_id", main_id);

      const response = await axios.post(myurl, bodyFormData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      console.log('getPipingMultiSurface response', response);

      if (response.data.success) {
        return response.data.data; // only the array of surfaces
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const getPipingMultiSurfaceSlice = createSlice({
  name: "getPipingMultiSurface",
  initialState: {
    data: [],      // renamed from user -> data
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMultiSurface.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMultiSurface.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getPipingMultiSurface.rejected, (state, action) => {
        state.data = [];
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getPipingMultiSurfaceSlice.reducer;
