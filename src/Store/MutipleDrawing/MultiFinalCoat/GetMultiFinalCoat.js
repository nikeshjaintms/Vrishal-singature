import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiFinalCoat = createAsyncThunk(
  "/user/list-multi-final_coat-offer",
  async ({ paint_system_id }) => {
    try {
      const myurl = `${V_URL}/user/list-multi-final_coat-offer`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("paint_system_id", paint_system_id);

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

const getMultiFinalCoatSlice = createSlice({
  name: "getMultiFinalCoat",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiFinalCoat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiFinalCoat.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiFinalCoat.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiFinalCoatSlice.reducer;
