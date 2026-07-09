import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiSurfaceOfferViewPage = createAsyncThunk(
  "/user/piping-get-view-multi-surface",
  async ({page,limit,search}) => {
    try {
      const myurl = `${V_URL}/user/piping-get-view-multi-surface`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
   if(page)   bodyFormData.append("page", page);
     if(limit) bodyFormData.append("limit", limit);
     if(search) bodyFormData.append("search", search);

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

const getMultiSurfaceOfferViewPageSlice = createSlice({
  name: "getMultiSurfaceOfferViewPage",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiSurfaceOfferViewPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiSurfaceOfferViewPage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiSurfaceOfferViewPage.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiSurfaceOfferViewPageSlice.reducer;
