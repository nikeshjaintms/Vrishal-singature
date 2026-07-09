import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const UpdatesurfaceBalance = createAsyncThunk(
  "/user/surface-grid-balance-update",
  async ({ bodyFormData }) => {
    try {
      const myurl = `${V_URL}/user/surface-grid-balance-update`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });
console.log("response", response);
      const data = response.data;
      console.log("data", data);
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

const UpdatesurfaceBalanceSlice = createSlice({
  name: "UpdatesurfaceBalance",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UpdatesurfaceBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdatesurfaceBalance.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdatesurfaceBalance.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default UpdatesurfaceBalanceSlice.reducer;
