import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const pipingGetMultiPacking = createAsyncThunk(
  "/user/piping/get-multi-packing-offer",
  async () => {
    try {
      const myurl = `${V_URL}/user/piping/get-multi-packing-offer`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));

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

const pipingGetMultiPackingSlice = createSlice({
  name: "pipingGetMultiPacking",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pipingGetMultiPacking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pipingGetMultiPacking.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(pipingGetMultiPacking.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default pipingGetMultiPackingSlice.reducer;
