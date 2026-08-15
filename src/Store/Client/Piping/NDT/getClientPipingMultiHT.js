import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT PIPING HT LIST ================= */
export const getClientPipingMultiHT = createAsyncThunk(
  "getClientPipingMultiHT",
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

      const myurl = `${V_URL}/party/get-piping-ht-client`;

      const response = await axios.post(
        myurl,
        {
          project_id: projectId || "",
          page,
          limit,
          search,
        },
        {
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
        "Failed to fetch HT data"
      );

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ================= SLICE ================= */
const getClientPipingMultiHTSlice = createSlice({
  name: "getClientPipingMultiHT",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientPipingMultiHT.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientPipingMultiHT.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientPipingMultiHT.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientPipingMultiHTSlice.reducer;
