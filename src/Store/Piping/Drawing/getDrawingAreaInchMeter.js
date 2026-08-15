import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDrawingAreaInchMeterMasterData = createAsyncThunk(
  "/issue/getDrawingAreaInchMeterMasterData",
  async ({ page, limit, search, project }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-piping-drawing-area-inch-meter-master-data`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("page", page);
      bodyFormData.append("limit", limit);
      bodyFormData.append("search", search);
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


const getDrawingAreaInchMeterMasterDataSlice = createSlice({
  name: "getDrawingAreaInchMeterMasterData",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAreaInchMeterDrawItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDrawingAreaInchMeterMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrawingAreaInchMeterMasterData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDrawingAreaInchMeterMasterData.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearAreaInchMeterDrawItems } = getDrawingAreaInchMeterMasterDataSlice.actions;

export default getDrawingAreaInchMeterMasterDataSlice.reducer;
