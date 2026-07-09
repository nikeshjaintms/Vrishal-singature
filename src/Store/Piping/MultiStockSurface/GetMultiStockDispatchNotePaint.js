import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingMultiStockDispatchPaint = createAsyncThunk(
  "/user/getPipingMultiStockDispatchPaint",
  async ({ DATA }) => {
    try {
      const myurl = `${V_URL}/user/piping-dispatch-note-data-in-surface-offer`;
      const bodyFormData = new URLSearchParams();
      const Project = localStorage.getItem("U_PROJECT_ID");
      bodyFormData.append("project", Project);
      if (DATA?.paint_system_id) {
        bodyFormData.append("paint_system_id", DATA?.paint_system_id);
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
        throw new Error(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getPipingMultiStockDispatchPaintSlice = createSlice({
  name: "getPipingMultiStockDispatchPaint",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMultiStockDispatchPaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMultiStockDispatchPaint.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMultiStockDispatchPaint.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingMultiStockDispatchPaintSlice.reducer;
