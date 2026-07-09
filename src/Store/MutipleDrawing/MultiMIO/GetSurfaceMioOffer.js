import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const getMultiSurfaceOfferMio = createAsyncThunk(
  "/user/getMultiSurfaceOfferMio",
  async ({ DATA }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-multi-surface`;
      const bodyFormData = new URLSearchParams();
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const projectId = localStorage.getItem("U_PROJECT_ID");

      bodyFormData.append("project_id", projectId);
      bodyFormData.append("is_accepted", 2);

      if (DATA?.paint_system_id) {
        bodyFormData.append("paint_system_id", DATA.paint_system_id);
      }

      const response = await axios({
        method: "POST",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
    

      if (data.success === true) {


        return data;
      } else {
        return rejectWithValue(data.message || "Unknown error");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message || "API request failed";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

const getMultiSurfaceOfferMioSlice = createSlice({
  name: "getMultiSurface",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMultiSurfaceOfferMio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMultiSurfaceOfferMio.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMultiSurfaceOfferMio.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getMultiSurfaceOfferMioSlice.reducer;
