import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiStockMioIns = createAsyncThunk(
  "/user/get-multi-stock-mio",
  async ({ paint_system_id , page , limit,search}) => {
    try {
      const myurl = `${V_URL}/user/get-multi-stock-mio`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("paint_system_id", paint_system_id);
      if(page) bodyFormData.append("page", page);
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


const getMultiStockMioInsSlice = createSlice({
  name: "getMultiStockMioIns",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiStockMioIns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiStockMioIns.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiStockMioIns.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiStockMioInsSlice.reducer;
