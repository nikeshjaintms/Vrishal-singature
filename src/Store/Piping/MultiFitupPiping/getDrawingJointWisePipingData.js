import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
 
/**
 * GET DRAWING WISE PIPING DATA
 */
export const getDrawingJointWisePiping = createAsyncThunk(
  "/piping/getDrawingJointWisePiping",
  async ({ drawing_id, project_id }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (drawing_id) params.append("drawing_id", drawing_id);
      if (project_id) params.append("project_id", project_id);

 
      const queryString = params.toString();
      const myurl = queryString
        ? `${V_URL}/user/get-multi-drawing-issue-acceptance-joint-piping-data?${queryString}`
        : `${V_URL}/user/get-multi-drawing-issue-acceptance-joint-piping-data`;
 
      const response = await axios({
        method: "get",
        url: myurl,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });
 
      const data = response.data;
      console.log("DEBUG: getDrawingJointWisePiping response data:", data);

 
      if (data.success === true) {
        return data;
      } else {
        throw data;
      }
    } catch (error) {
      console.error("Redux Error:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
      return rejectWithValue(error?.response?.data);
    }
  }
);
 
const getDrawingJointWisePipingSlice = createSlice({
  name: "getDrawingJointWisePiping",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDrawingJointWisePiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrawingJointWisePiping.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDrawingJointWisePiping.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
 
export default getDrawingJointWisePipingSlice.reducer;
 