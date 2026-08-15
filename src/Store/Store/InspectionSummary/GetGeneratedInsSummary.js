import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserGenInspectionSummary = createAsyncThunk(
  "/party/getUserGenInspectionSummary",
  async ({page, limit, search}) => {
    try {
      const myurl = `${V_URL}/user/list-multi-inspect-generate`;
      const Project = localStorage.getItem("U_PROJECT_ID");
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", Project);
      if(page)  bodyFormData.append("page", page);
      if(limit)  bodyFormData.append("limit", limit);
      if(search)  bodyFormData.append("search", search);
      const response = await axios({
        method: "Post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response?.data;

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

const getUserGenInspectionSummarySlice = createSlice({
  name: "getUserGenInspectionSummary",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserGenInspectionSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGenInspectionSummary.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserGenInspectionSummary.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUserGenInspectionSummarySlice.reducer;
