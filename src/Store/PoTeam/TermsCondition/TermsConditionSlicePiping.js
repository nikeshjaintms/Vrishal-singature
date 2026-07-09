import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ================= GET ALL TERMS ================= */
export const getAllTermsPiping = createAsyncThunk(
  "terms/getAllPiping",
  async ({ project, search = "", page , limit}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/terms-condition/get-all-terms-condition-piping`,
         {
          project,
          search,
          ...(page !== undefined && { page }),
          ...(limit !== undefined && { limit }),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        return response.data.data; // { total, page, limit, data }
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching terms");
      return rejectWithValue(err.message);
    }
  }
);


/* ================= SLICE ================= */
const termsSlicePiping = createSlice({
  name: "getAllTermsPiping",
  initialState: {
    list: {
      total: 0,
      page: 1,
      limit: 10,
      data: [],
    },
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- GET ALL ---------- */
      .addCase(getAllTermsPiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTermsPiping.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(getAllTermsPiping.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- GET BY ID ---------- */
  },
});

export default termsSlicePiping.reducer;
