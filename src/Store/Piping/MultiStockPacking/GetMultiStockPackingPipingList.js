import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiStockPackingPipingList = createAsyncThunk(
  "/user/piping/get-multi-stock-packing",
  async ({ page, limit, search }) => {
    try {
      const myurl = `${V_URL}/user/piping/get-multi-stock-packing?page=${page}&limit=${limit}&search=${search}`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("page", page);
      bodyFormData.append("limit", limit);
      const response = await axios({
        method: "POST",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });
      const data = response.data;
      console.log("Data fetching...", data);
      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getMultiPackingStockPipingListSlice = createSlice({
  name: "getMultiStockPackingPipingList",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiStockPackingPipingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiStockPackingPipingList.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiStockPackingPipingList.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiPackingStockPipingListSlice.reducer;


