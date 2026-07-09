// src/redux/slices/customer/getCustomersSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// Thunk to fetch customer data
export const getCustomers = createAsyncThunk(
  "/customer/getCustomers",
  async ({ storeType, is_main,name }) => {
    try {
      const myurl = `${V_URL}/user/get-firm`; // <-- Your actual API endpoint

      const bodyFormData = new URLSearchParams();
      if (!is_main) {
        const project = localStorage.getItem("U_PROJECT_ID");
        bodyFormData.append("project", project);
        
      }
       bodyFormData.append("name", name);
    //   bodyFormData.append("store_type", storeType);
    //   bodyFormData.append("is_admin", false);

      const response = await axios({
        method: "get",
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
        throw new Error(data.message || "Failed to fetch customers.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
      throw error;
    }
  }
);

// Slice to manage customer state
const getCustomersSlice = createSlice({
  name: "getCustomers",
  initialState: {
    customers: [],
    loading: false,
    error: null,
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.data; // or action.payload.customers
        state.loading = false;
        state.error = null;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.customers = [];
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getCustomersSlice.reducer;
