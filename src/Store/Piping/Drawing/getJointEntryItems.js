import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getJointEntryItems = createAsyncThunk(
  "/issue/getJointEntryItems",
  async ({drawing_id }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-joint-entry-items`;

      console.log("drawing_id in thunk:", drawing_id);

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("drawing_id", drawing_id);
      // bodyFormData.append("spool_no_id", spool_no_id);
        
     

      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      console.log("data",data);
      if (data.success === true) {
        return data;
      } else {
        toast.error(data.message || "Failed to fetch joint entry items");
        return rejectWithValue(data);
      }
    } catch (error) {
      console.error("Error in getJointEntryItems:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getJointEntryItemsSlice = createSlice({
  name: "getJointEntryItems",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearJointItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJointEntryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJointEntryItems.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getJointEntryItems.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearJointItems } = getJointEntryItemsSlice.actions;

export default getJointEntryItemsSlice.reducer;
