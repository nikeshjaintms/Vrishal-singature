import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const pipingGetMultiStockPacking = createAsyncThunk(
  "/user/piping/get-multi-stock-packing-offer",
  async () => {
    try {
      const myurl = `${V_URL}/user/piping/get-multi-stock-packing-offer`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));

      const response = await axios({
        method: "POST",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      console.log(data, "getDispatchNotes response");

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

const pipingGetMultiStockPackingSlice = createSlice({
  name: "pipingGetMultiStockPacking",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pipingGetMultiStockPacking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pipingGetMultiStockPacking.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(pipingGetMultiStockPacking.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default pipingGetMultiStockPackingSlice.reducer;
