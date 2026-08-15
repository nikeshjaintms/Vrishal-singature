import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiDispatchPaintByPass = createAsyncThunk(
  "/user/getMultiDispatchPaint",
  async ({ DATA }) => {
    try {
      const myurl = `${V_URL}/user/get-multi-dispatch`;
      const bodyFormData = new URLSearchParams();
      const Project = localStorage.getItem("U_PROJECT_ID");
      bodyFormData.append("project_id", Project);
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

const getMultiDispatchPaintByPassSlice = createSlice({
  name: "getMultiDispatchPaint",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiDispatchPaintByPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiDispatchPaintByPass.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiDispatchPaintByPass.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiDispatchPaintByPassSlice.reducer;
