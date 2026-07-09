import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminTransport = createAsyncThunk(
  "/transport/getAdminTransport",
  async ({ is_main }) => {
    try {
      const project = localStorage.getItem("U_PROJECT_ID");
      let myurl;
      if (!is_main) {
        myurl = `${V_URL}/user/get-admin-transport?projects=${project}`;
      } else {
        myurl = `${V_URL}/user/get-admin-transport`;
      }
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const bankData = response.data;

      if (bankData.success === true) {
        return bankData;
      } else {
        throw new Error(bankData);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getAdminTransportSlice = createSlice({
  name: "getAdminTransport",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminTransport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminTransport.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminTransport.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminTransportSlice.reducer;
