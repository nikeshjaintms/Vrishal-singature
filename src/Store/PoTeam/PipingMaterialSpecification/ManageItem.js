import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addItem = createAsyncThunk(
  '/add/addItem',
  async (add) => {

    try {
      const myurl = `${V_URL}/user/manage-item`;

      const response = await axios({
        method: 'post',
        url: myurl,
        data: add,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
        },
      });

      const addItem = response.data;
      // console.log(addItem, '@@@')

      if (addItem.success === true) {
        toast.success(addItem?.message);
        return addItem;
      } else {
        // console.log(addItem.message, "&&&&")
        throw new Error(addItem);
      }
    } catch (error) {
      // console.log(error, "!!!!")
      toast.error(error.response.data.message);
      return error;
    }
  }
);


const addItemSlice = createSlice({
  name: "addItem",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  }
})

export default addItemSlice.reducer;