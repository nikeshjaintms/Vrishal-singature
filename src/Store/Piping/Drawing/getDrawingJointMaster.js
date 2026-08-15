import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDrawingJointMasterData = createAsyncThunk(
  "/issue/getDrawingJointMasterData",
  async ({ page, limit, search, project }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-piping-drawing-joint-master-data`;

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


const getDrawingJointMasterDataSlice = createSlice({
  name: "getDrawingJointMasterData",
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
      .addCase(getDrawingJointMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrawingJointMasterData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDrawingJointMasterData.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearJointDrawItems } = getDrawingJointMasterDataSlice.actions;

export default getDrawingJointMasterDataSlice.reducer;
