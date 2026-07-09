import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const MPTOfferData = createAsyncThunk(
  "/user/piping/mpt-offer-table-data",
  async ({ project_id, rtType }) => {
    try {
      const myurl = `${V_URL}/user/piping/mpt-offer-table-data`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: { project_id: project_id, rtType: rtType },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      if (data.success === true) {
        return data;
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const MPTOfferDataSlice = createSlice({
  name: "MPTOfferData",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(MPTOfferData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MPTOfferData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(MPTOfferData.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default MPTOfferDataSlice.reducer;
