import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

/* ================= GET CLIENT MULTI RELEASE NOTE ================= */
export const getClientReleaseNote = createAsyncThunk(
  "/party/getClientReleaseNote",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const projectId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const { page = 1, limit = 10, search = "" } = params;
      
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);
      queryParams.append("project", projectId);
      if (search) {
        queryParams.append("search", search);
      }

      const myurl = `${V_URL}/party/get-multi-release-note-view?${queryParams.toString()}`;

      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response?.data?.success === true) {
        return response.data;
      }

      return rejectWithValue(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch data");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ================= SLICE ================= */
const getClientReleaseNoteSlice = createSlice({
  name: "getClientReleaseNote",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientReleaseNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientReleaseNote.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientReleaseNote.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientReleaseNoteSlice.reducer;
