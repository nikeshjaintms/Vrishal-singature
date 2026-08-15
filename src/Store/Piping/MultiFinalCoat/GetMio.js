import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingMioList = createAsyncThunk(
  "/user/getPipingMioList",
  async (params = {}) => {
    try {
      const { page, limit, search, DATA, isFp } = params;
      const myurl = `${V_URL}/user/piping-get-multi-mio`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      // bodyFormData.append("is_accepted", 2);
      if (page) bodyFormData.append("page", page);
      if (limit) bodyFormData.append("limit", limit);
      if (search) bodyFormData.append("search", search);
      if (isFp) bodyFormData.append("isFp", isFp);
      if (DATA?.report_no) {
        bodyFormData.append("report_no", DATA.report_no);
      }

      const response = await axios({
        method: "POSt",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

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

const getPipingMioListSlice = createSlice({
  name: "getPipingMioList",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMioList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMioList.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMioList.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingMioListSlice.reducer;
