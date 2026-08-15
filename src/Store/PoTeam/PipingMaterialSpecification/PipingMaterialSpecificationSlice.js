import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET AREAS ----------
export const getPipingMaterialSpecificationsAction = createAsyncThunk(
  "pipingmaterialspecifications/getPipingMaterialSpecifications",
  async ({ project, search = "", page = "", limit = "" }) => {
    try {
      const projectId = project || localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/piping-material-specification/get-piping-material-specification?project=${projectId}&search=${search}&page=${page}&limit=${limit}`;

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
        throw new Error(data.message || "Failed to fetch pipingmaterialspecifications");
      }
    } catch (error) {
      console.log(error, "getPipingMaterialSpecifications error");
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);

const pipingmaterialspecificationSlice = createSlice({
  name: "pipingmaterialspecifications",
  initialState: {
    data: { total: 0, page: 1, limit: 10, pipingmaterialspecifications: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingMaterialSpecificationsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingMaterialSpecificationsAction.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingMaterialSpecificationsAction.rejected, (state, action) => {
        state.data = { total: 0, page: 1, limit: 10, pipingmaterialspecifications: [] };
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default pipingmaterialspecificationSlice.reducer;
