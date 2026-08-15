import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT PIPING LPT LIST ================= */
export const getClientPipingMultiLPT = createAsyncThunk(
  "getClientPipingMultiLPT",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const projectId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const {
        page = 1,
        limit = 10,
        search = "",
      } = params;

      const myurl = `${V_URL}/party/get-piping-lpt-client`;

      const response = await axios.post(
        myurl,
        {},
        {
          params: {
            project: projectId || "",
            page,
            limit,
            search,
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response?.data?.success === true || response?.status === 200) {
        return response.data;
      }

      return rejectWithValue(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch LPT data"
      );

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= SLICE ================= */
const getClientPipingMultiLPTSlice = createSlice({
  name: "getClientPipingMultiLPT",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientPipingMultiLPT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientPipingMultiLPT.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientPipingMultiLPT.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientPipingMultiLPTSlice.reducer;
