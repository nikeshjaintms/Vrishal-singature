import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const getUserWpsMasterPiping = createAsyncThunk(
  '/issue/getUserWpsMasterPiping', // The action type string
  async (
    { status = 'all', page = 1, limit = 10, search = '' } = {}, // Default values for parameters
    { rejectWithValue }
  ) => {
    try {
      // Get the project and token from localStorage
      const project = localStorage.getItem('U_PROJECT_ID');
      const token = localStorage.getItem('PAY_USER_TOKEN');

      // Prepare the data to send in the request body
      const requestData = {
        status,
        project,
        search,
        page,
        limit,
      };

      // Make the API request using axios.post
      const response = await axios.post(
        `${V_URL}/user/get-all-wps`, // Your backend URL
        requestData, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Check the response for success and return data
      if (response.data.success) {
        return response.data; // Return the data to be used in reducers
      } else {
        // If API response indicates failure, throw an error
        throw new Error(response.data.message || 'Failed to fetch WPS');
      }
    } catch (error) {
      // Handle errors and reject with value to be handled by the reducer
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


const getUserWpsMasterPipingSlice = createSlice({
  name: "getUserWpsMasterPiping",
  initialState: {
    data: [], // array of WPS items
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserWpsMasterPiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWpsMasterPiping.fulfilled, (state, action) => {
        const apiData = action.payload?.data || {}; // { data: [...], total, page, pages }
        const items = Array.isArray(apiData.data) ? apiData.data : [];


        state.data = items;
        state.total = apiData.total || 0; // use API total
        state.page = apiData.page || 1;
        state.pages = apiData.pages || 1;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserWpsMasterPiping.rejected, (state, action) => {
        const errorMessage = action.payload?.message || action.error?.message || "Unknown error";

        state.data = [];
        state.total = 0;
        state.page = 1;
        state.pages = 1;
        state.loading = false;
        state.error = errorMessage;
      });
  },
});

export default getUserWpsMasterPipingSlice.reducer;

