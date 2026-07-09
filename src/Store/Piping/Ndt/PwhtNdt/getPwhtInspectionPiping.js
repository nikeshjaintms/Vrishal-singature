import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";



export const getPwhtInspectionPiping = createAsyncThunk(
  "/party/getPwhtInspectionPiping",
  async (params = {}, { rejectWithValue }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const { page, limit , search , status } = params;

      // Build query string dynamically
      const queryParams = new URLSearchParams();
      if (page != null) queryParams.append("page", page);
      if (limit != null) queryParams.append("limit", limit);
       if (search != null) queryParams.append("search", search);
         if (status != null) queryParams.append("status", status);
      queryParams.append("project", proId);

      const myurl = `${V_URL}/user/get-pwht-inspection-piping?${queryParams.toString()}`;

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
        return rejectWithValue(data);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getPwhtInspectionPipingSlice = createSlice({
    name: "getPwhtInspectionPiping",
    initialState: {
        user: null,
         dataByStatus: {},
        loading: false,
        error: null,
    },
    
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPwhtInspectionPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(getPwhtInspectionPiping.fulfilled, (state, action) => {
            //   //  const statusKey = action.meta.arg.status; // 👈 IMPORTANT
            //   //   state.dataByStatus[statusKey] = action.payload;
                
            //     state.user = action.payload;
            //     state.loading = false;
            //     // state.error = null;
            // })

            .addCase(getPwhtInspectionPiping.fulfilled, (state, action) => {
  const rawStatus = action.meta.arg.status;

  // 👇 normalize key
  const statusKey = rawStatus ? rawStatus.toString() : "ALL";

  state.dataByStatus[statusKey] = {
    data: action.payload.data,
    pagination: action.payload.pagination,
  };

  state.loading = false;
})

            .addCase(getPwhtInspectionPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPwhtInspectionPipingSlice.reducer;