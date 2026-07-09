import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ---------- GET ALL MATERIAL MTO ----------
export const getAllMaterialMto = createAsyncThunk(
  "materialMto/getAll",
  async ({ project, search = "", page , limit, status }, { rejectWithValue }) => {
    try {
      const body = { project, search, page, limit };
      if (status !== undefined && status !== null && status !== "") {
        body.status = status;
      }

      const response = await axios.post(
        `${V_URL}/user/material/get-all-material-mto`,
        body,
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching MTOs");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- GET MATERIAL MTO BY ID ----------
export const getMaterialMtoById = createAsyncThunk(
  "materialMto/getById",
  async (payload, { rejectWithValue }) => {
    try {
      const id = payload.id;
      console.log("getMaterialMtoById called with id:", id);
      const response = await axios.post(
        `${V_URL}/user/material/get-material-mto-by-id`,
        { id },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching MTO");
      return rejectWithValue(err.message);
    }
  }
);





// ---------- SLICE ----------
const materialMtoSlice = createSlice({
  name: "materialMto",
  initialState: {
    list: { total: 0, page: 1, limit: 10, data: [] },
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllMaterialMto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMaterialMto.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllMaterialMto.rejected, (state, action) => {
        state.list = { total: 0, page: 1, limit: 10, data: [] };
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getMaterialMtoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialMtoById.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMaterialMtoById.rejected, (state, action) => {
        state.single = null;
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export default materialMtoSlice.reducer;
