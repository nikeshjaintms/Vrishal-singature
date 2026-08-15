import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDmr = createAsyncThunk("/party/getDmr", async () => {
  try {
    const project = localStorage.getItem("U_PROJECT_ID");
    const myurl = `${V_URL}/user/dmr/get-by-project`;

    const response = await axios({
      method: "post",
      url: myurl,
      data: {project},
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
    console.log(error, "error");
    toast.error(error.response?.data?.message || 'Failed to fetch DMR');
    return error;
  }
});

export const manageDmr = createAsyncThunk("/party/manageDmr", async (dmrData) => {
  try {
    const myurl = `${V_URL}/user/dmr/manage-dmr`;
    const response = await axios({
      method: "post",
      url: myurl,
      data: dmrData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });
    const data = response.data;
    if (data.success === true) {
      toast.success(data?.message);
      return data;
    } else {
      throw new Error(data);
    }
  } catch (error) {
    console.log(error, "error");
    toast.error(error.response?.data?.message || "Failed to manage DMR");
    return error;
  }
});

const getDmrSlice = createSlice({
  name: "getDmr",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDmr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDmr.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDmr.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(manageDmr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageDmr.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(manageDmr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getDmrSlice.reducer;
