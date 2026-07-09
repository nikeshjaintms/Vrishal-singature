import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDispatchNotes = createAsyncThunk(
  "user/get-multi-dispatch",
  async ({ DATA = {}, page = null, limit = null , search}, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-multi-dispatch?search=${search ? search : ''}`;
      const bodyFormData = new URLSearchParams();
      const Project = localStorage.getItem("U_PROJECT_ID");

      bodyFormData.append("project_id", Project);

      // Only include pagination if provided
      if (page !== null && limit !== null) {
        bodyFormData.append("page", page);
        bodyFormData.append("limit", limit);
        bodyFormData.append("search", search);
      }

      // Optional filters
      if (DATA?.paint_system_id) {
        bodyFormData.append("paint_system_id", DATA.paint_system_id);
      }
      if (DATA?.report_no) {
        bodyFormData.append("report_no", DATA.report_no);
      }
      if (DATA?.dispatch_site) {
        bodyFormData.append("dispatch_site", DATA.dispatch_site);
      }

      const response = await axios({
        method: "POST",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || "Unknown server error");
      }
    } catch (error) {
      console.error("Dispatch fetch error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch dispatch notes");
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const getDispatchNotesSlice = createSlice({
  name: "getDispatchNotes",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDispatchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDispatchNotes.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDispatchNotes.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getDispatchNotesSlice.reducer;
