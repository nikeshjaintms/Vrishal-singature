import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const GetFinalCoatClearance = createAsyncThunk(
  "/user/get-multi-final-coat-clearance",
  async ({ page, limit, search }) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const bodyFormData = new URLSearchParams();
    bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    if (search) bodyFormData.append("search", search);

    const response = await axios({
      method: "POST",
      // url: `${V_URL}/user/get-multi-final-coat-clearance?${queryParams.toString()}&search=${search}`,
      url: `${V_URL}/user/get-multi-final-coat-clearance?${queryParams.toString()}`,

      data: bodyFormData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });
    //response data so Redux can use it
    return response.data;
  }
);

const GetFinalCoatClearanceSlice = createSlice({
  name: "GetFinalCoatClearance",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetFinalCoatClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFinalCoatClearance.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetFinalCoatClearance.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetFinalCoatClearanceSlice.reducer;
