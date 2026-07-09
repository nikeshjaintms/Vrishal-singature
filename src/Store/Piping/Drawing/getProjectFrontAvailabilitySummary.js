import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getProjectFrontAvailabilitySummary = createAsyncThunk(
  "/issue/getProjectFrontAvailabilitySummary",
  async ({ page, limit, search,status, project }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-project-front-availability-piping`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("page", page);
      bodyFormData.append("limit", limit);
      bodyFormData.append("search", search);
      bodyFormData.append("status", status);
      bodyFormData.append("project", project);

      const response = await axios({
        method: "post", // <-- backend expects POST
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const getProjectFrontAvailabilitySummarySlice = createSlice({
  name: "getProjectFrontAvailabilitySummary",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMaterialDrawItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectFrontAvailabilitySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectFrontAvailabilitySummary.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProjectFrontAvailabilitySummary.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearProjectFrontAvailabilitySummary } = getProjectFrontAvailabilitySummarySlice.actions;

export default getProjectFrontAvailabilitySummarySlice.reducer;
