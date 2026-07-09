import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const getDpr = createAsyncThunk("/party/getDpr", async ({ page , limit, search}, thunkAPI) => {
  try {
    const projectId = localStorage.getItem("U_PROJECT_ID");
    const myurl = `${V_URL}/user/get-grid-dpr?project=${projectId}&page=${page}&limit=${limit}&search=${search}`;

    const response = await axios.get(myurl, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });

    const data = response.data;

    if (data.success === true) {
      return data;
    } else {
      throw new Error(data.message || "Failed to fetch DPR data");
    }
  } catch (error) {
    console.error(error, "DPR Fetch Error");
    toast.error(error?.response?.data?.message || error.message || "An error occurred");
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
  }
});

const getDprSlice = createSlice({
  name: "getDpr",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDpr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDpr.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDpr.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getDprSlice.reducer;
