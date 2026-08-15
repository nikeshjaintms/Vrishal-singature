import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const getItemDetails = createAsyncThunk(
  "/party/getItemDetails",
  async ({ is_main }) => {
    try {
      const projectId = localStorage.getItem("U_PROJECT_ID");
      
      // Build dynamic query params
      const queryParams = new URLSearchParams();
      if (is_main) queryParams.append("is_main", is_main);
      if (!is_main && projectId) queryParams.append("project", projectId);
      
      const myurl = `${V_URL}/user/get-item-details?${queryParams.toString()}`;

      const response = await axios.get(myurl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getAdminItem response");

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch item data");
      }
    } catch (error) {
      console.error(error, "error");
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      return Promise.reject(error);
    }
  }
);


const getItemDetailsSlice = createSlice({
  name: "getItemDetails",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItemDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getItemDetails.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getItemDetailsSlice.reducer;
