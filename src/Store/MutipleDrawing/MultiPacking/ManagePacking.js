import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const managePacking = createAsyncThunk(
  "/user/manage-multi-packing",
  async ({ payload }) => {
    try {
      const myurl = `${V_URL}/user/manage-multi-packing`;
      
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

const managePackingSlice = createSlice({
  name: "managePacking",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(managePacking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(managePacking.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(managePacking.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default managePackingSlice.reducer;
