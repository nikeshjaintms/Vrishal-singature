import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET AREAS ----------
export const getAreasAction = createAsyncThunk(
  "areas/getAreas",
  async ({ project, search = "", page = "", limit = "" }) => {
    try {
      const projectId = project || localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/area-unit/get-area-unit-piping?project=${projectId}&search=${search}&page=${page}&limit=${limit}`;

      const response = await axios({
        method: "POST",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

      if (data.success === true) {
        return data.data; // return only "data" part
      } else {
        throw new Error(data.message || "Failed to fetch areas");
      }
    } catch (error) {
      console.log(error, "getAreas error");
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);

const areaSlice = createSlice({
  name: "areas",
  initialState: {
    data: { total: 0, page: 1, limit: 10, areas: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAreasAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAreasAction.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAreasAction.rejected, (state, action) => {
        state.data = { total: 0, page: 1, limit: 10, areas: [] };
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default areaSlice.reducer;
