import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getFdTable = createAsyncThunk(
  "/party/getFdTable",
  async ({ bodyFormData }) => {
    try {
      const myurl = `${V_URL}/user/get-fd-offer-table`;
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
        throw new Error(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error?.response?.data?.message);
      return error;
    }
  }
);

const getFdTableSlice = createSlice({
  name: "getFdTable",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFdTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFdTable.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getFdTable.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getFdTableSlice.reducer;
