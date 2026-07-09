import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const GetFinalCoatQcOffer = createAsyncThunk(
  "/user/get-multi-final-qc-offer",
  async ({ page, limit, search }) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const bodyFormData = new URLSearchParams();
    bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    if (search) bodyFormData.append("search", search);

    const response = await axios({
      method: "POST",
      url: `${V_URL}/user/get-multi-final-qc-offer?${queryParams.toString()}&search=${search}`,
      data: bodyFormData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });
    //response data so Redux can use it
    return response.data;
  }
);

const GetFinalCoatQcOfferSlice = createSlice({
  name: "GetFinalCoatQcOffer",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetFinalCoatQcOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetFinalCoatQcOffer.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetFinalCoatQcOffer.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetFinalCoatQcOfferSlice.reducer;
