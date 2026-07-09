import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const manageStockPacking = createAsyncThunk(
  "/user/manage-multi-stock-packing",
  async ({ payload }) => {
    try {
      const myurl = `${V_URL}/user/piping/manage-multi-stock-packing`;
      
      const response = await axios({
        method: "post",
        url: myurl,
        data: payload,
        
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });
 
      const data = response.data;
      console.log("api wORKED",data);
     
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

const manageStockPackingSlice = createSlice({
  name: "manageStockPacking",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(manageStockPacking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageStockPacking.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(manageStockPacking.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default manageStockPackingSlice.reducer;
