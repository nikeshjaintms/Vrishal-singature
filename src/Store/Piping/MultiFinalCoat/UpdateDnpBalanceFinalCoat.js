import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const UpdateDnpBalanceFinalCoat = createAsyncThunk(
  "/user/dnp-grid-balance-update-final-coat",
  async ({ bodyFormData }) => {
    try {
      const myurl = `${V_URL}/user/dnp-grid-balance-update-final-coat`;
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

const UpdateDnpBalanceFinalCoatSlice = createSlice({
  name: "UpdateDnpFinalCoatBalance",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UpdateDnpBalanceFinalCoat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateDnpBalanceFinalCoat.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateDnpBalanceFinalCoat.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default UpdateDnpBalanceFinalCoatSlice.reducer;
