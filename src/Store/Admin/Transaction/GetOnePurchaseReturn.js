import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getOnePUR = createAsyncThunk("/admin/one-pur", async ({ id }) => {
  try {
    const myurl = `${V_URL}/admin/one-pur`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("id", id);
    const response = await axios({
      method: "post",
      url: myurl,
      data: bodyFormData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
      },
    });

    const data = response.data;
    // console.log(data, "getOrder response");

    if (data.success === true) {
      return data;
    } else {
      throw new Error(data);
    }
  } catch (error) {
    toast.error(error.response.data.message);
    return error;
  }
});

const getSinglePURSlice = createSlice({
  name: "getOnePUR",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOnePUR.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOnePUR.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOnePUR.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getSinglePURSlice.reducer;
