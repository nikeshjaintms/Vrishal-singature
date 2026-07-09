import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const GetProjectAttendance = createAsyncThunk(
  "/admin/get-project-attendance",
  async (data) => {
    try {
      const myurl = `${V_URL}/admin/get-project-attendance`;

      const response = await axios({
        method: "post",
        url: myurl,
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      });

      const addItem = response.data;
      // console.log(addItem, '@@@')

      if (addItem.success === true) {
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

const GetProjectAttendanceSlice = createSlice({
  name: "GetProjectAttendance",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetProjectAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProjectAttendance.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetProjectAttendance.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetProjectAttendanceSlice.reducer;
