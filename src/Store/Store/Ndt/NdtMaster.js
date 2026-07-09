import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserNdtMaster = createAsyncThunk(
  "/issue/getUserNdtMaster",
  async ({ status }) => {
    try {
      const projectId = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-ndt?status=${status}&project=${projectId}`;
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      console.log(data, "getUserNdtMaster response");
      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getUserNdtMasterSlice = createSlice({
  name: "getUserNdtMaster",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getUserNdtMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNdtMaster.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserNdtMaster.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserNdtMasterSlice.reducer;
