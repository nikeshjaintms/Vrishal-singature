import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addIssue = createAsyncThunk(
  '/user/add-ms-transaction',
  async (payload) => {

    try {
      const myurl = `${V_URL}/user/add-ms-transaction`;

      const response = await axios({
        method: 'post',
        url: myurl,
        data: payload,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
        },
      });

      const data = response.data;
      // console.log(data, "getUserIssue response");
      if (data.success === true) {
        toast.success(data.message)
          return data;
      } else {
        toast.error(response.data?.message || 'Something went wrong');
      }
  } catch (error) {
      toast.error(error.response.data.message);
      return error
  }
  }
);


const addIssueSlice = createSlice({
  name: "addIssue",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addIssue.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export default addIssueSlice.reducer;