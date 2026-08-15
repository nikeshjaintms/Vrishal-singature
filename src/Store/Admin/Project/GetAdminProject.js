import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// get projects for show on admin dashboard

export const getAdminProject = createAsyncThunk(
  "/admin/get-admin-project",
  async () => {
    try {
      const myurl = `${V_URL}/admin/get-admin-project`;

      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "adminGetEmployee response");

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

const getAdminProjectSlice = createSlice({
  name: "getAdminProject",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProject.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminProject.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminProjectSlice.reducer;
