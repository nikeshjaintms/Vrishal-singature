import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserPipingClassMaster = createAsyncThunk(
  "/issue/getUserPipingClassMaster",
  async ({ status }) => {
    try {
      const Project = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/get-piping-request?status=${status}&project=${Project}`;
      const response = await axios({
        method: "get",
        url: myurl,
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


// 🔹 FETCH SINGLE PIPING CLASS BY ID
export const getUserPipingClassById = createAsyncThunk(
  "/piping/getUserPipingClassById",
  async ({ id }) => {
    try {
      const myurl = `${V_URL}/user/get-piping-request-by-id?id=${id}`;
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      if (data.success === true) return data;
      else throw new Error(data.message || "Failed to fetch piping class");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);



const getUserPipingClassMasterSlice = createSlice({
  name: "getUserPipingClassMaster",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserPipingClassMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPipingClassMaster.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserPipingClassMaster.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      })

  },
});

export default getUserPipingClassMasterSlice.reducer;
