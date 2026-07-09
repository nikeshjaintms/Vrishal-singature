import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserInspectionSummary = createAsyncThunk(
  "/party/getUserInspectionSummary",
  async () => {
    try {
      const myurl = `${V_URL}/user/get-multi-inspect-summary`;
      const Project = localStorage.getItem("U_PROJECT_ID");
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", Project);
      const response = await axios({
        method: "Post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response?.data;
      // console.log(data, "getUserInspectionSummary response");

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

const getUserInspectionSummarySlice = createSlice({
  name: "getUserInspectionSummary",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInspectionSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInspectionSummary.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserInspectionSummary.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserInspectionSummarySlice.reducer;
