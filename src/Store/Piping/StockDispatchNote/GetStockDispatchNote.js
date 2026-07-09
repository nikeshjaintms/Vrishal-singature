import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// ✅ Pass project and paint_system_id as arguments
export const getPipingStockDispatchNotes = createAsyncThunk(
  '/party/piping-get-multi-stock-dispatch',
  async ({ page,limit,search,project }) => {
    try {
      if (!project) throw new Error("Project ID is required");

      const myurl = `${V_URL}/user/piping-get-multi-stock-dispatch`;

      const bodyFormData = new URLSearchParams();
      
      bodyFormData.append("project", project);
      bodyFormData.append("page", page);    
      bodyFormData.append("limit", limit);  
      bodyFormData.append("search", search); 
      const response = await axios.post(myurl, bodyFormData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
          "Content-Type": "application/x-www-form-urlencoded"
        },
      });

      const data = response.data;

      // console.log(data);

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch dispatch notes");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
      throw error; // Important: let Redux know the request failed
    }
  }
);

const getPipingStockDispatchNotesSlice = createSlice({
  name: "getPipingStockDispatchNotes",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPipingStockDispatchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPipingStockDispatchNotes.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPipingStockDispatchNotes.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPipingStockDispatchNotesSlice.reducer;
