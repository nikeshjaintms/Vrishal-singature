import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

export const getLineHistorySheetDataPiping = createAsyncThunk(
  "/issue/getLineHistorySheetDataPiping",
  async ({ page, limit, search, project }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-line-history-sheet-piping`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("page", page);
      bodyFormData.append("limit", limit);
      bodyFormData.append("search", search);
      bodyFormData.append("project", project);

      const response = await axios({
        method: "post", 
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


const getLineHistorySheetDataPipingSlice = createSlice({
  name: "getLineHistorySheetDataPiping",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearJointDrawItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLineHistorySheetDataPiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLineHistorySheetDataPiping.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getLineHistorySheetDataPiping.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearJointDrawItems } = getLineHistorySheetDataPipingSlice.actions;

export default getLineHistorySheetDataPipingSlice.reducer;
