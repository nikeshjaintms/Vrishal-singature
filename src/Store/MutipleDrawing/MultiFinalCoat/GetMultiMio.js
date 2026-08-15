import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMioFilterList = createAsyncThunk(
  "/user/getMioFilterList",
  async ({ DATA }) => {
    try {
      const myurl = `${V_URL}/user/get-multi-mio`;
      const bodyFormData = new URLSearchParams();
      const Project = localStorage.getItem("U_PROJECT_ID");
      bodyFormData.append("project_id", Project);
      bodyFormData.append("is_accepted", 2);
      if (DATA?.report_no || DATA?.dispatch_site || DATA?.paint_system_id) {
        bodyFormData.append("paint_system_id", DATA?.paint_system_id);
        bodyFormData.append("report_no", DATA?.report_no);
        bodyFormData.append("dispatch_site", DATA?.dispatch_site);
      }

      const response = await axios({
        method: "POSt",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getDispatchNotes response");

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

const getMioFilterListSlice = createSlice({
  name: "getMioFilterList",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMioFilterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMioFilterList.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMioFilterList.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMioFilterListSlice.reducer;
