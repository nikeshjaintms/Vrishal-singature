import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingMultiDispatchPaint = createAsyncThunk(
  "/user/getPipingMultiDispatchPaint",
  async ({ DATA, isSurface }) => {
    try {
      const myurl = `${V_URL}/user/piping-get-multi-dispatch`;
      const bodyFormData = new URLSearchParams();
      const Project = localStorage.getItem("U_PROJECT_ID");
      bodyFormData.append("project", Project);
      if (DATA?.paint_system_id) {
        bodyFormData.append("paint_system_id", DATA?.paint_system_id);
      }
      if (isSurface) {
        bodyFormData.append("isSurface", "true");
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

const getPipingMultiDispatchPaintSlice = createSlice({
  name: "getPipingMultiDispatchPaint",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMultiDispatchPaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMultiDispatchPaint.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMultiDispatchPaint.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingMultiDispatchPaintSlice.reducer;
