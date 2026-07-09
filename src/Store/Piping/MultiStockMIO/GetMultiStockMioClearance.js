import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingMultiStockMioClearance = createAsyncThunk(
  "/user/piping-get-multi-stock-mio-clearance",
  async ({ paint_system_id , page , limit,search}) => {
    try {
      const myurl = `${V_URL}/user/piping-get-multi-stock-mio-clearance`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("paint_system_id", paint_system_id);
      bodyFormData.append("page", page);
      bodyFormData.append("limit", limit);
      bodyFormData.append("search", search);

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


const getPipingMultiStockMioClearanceSlice = createSlice({
  name: "getPipingMultiStockMioClearance",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMultiStockMioClearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMultiStockMioClearance.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMultiStockMioClearance.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingMultiStockMioClearanceSlice.reducer;
