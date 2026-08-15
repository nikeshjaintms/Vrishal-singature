import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiMio = createAsyncThunk(
  "/user/list-multi-mio-offer",
  async ({ paint_system_id }) => {
    try {
      const myurl = `${V_URL}/user/list-multi-mio-offer`;
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

const getMultiMioSlice = createSlice({
  name: "getMultiMio",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiMio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiMio.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiMio.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiMioSlice.reducer;
