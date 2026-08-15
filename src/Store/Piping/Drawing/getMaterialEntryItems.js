import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMaterialEntryItems = createAsyncThunk(
  "/issue/getMaterialEntryItems",
  async ({drawing_id }, { rejectWithValue }) => {
    try {
      const myurl = `${V_URL}/user/get-material-entry-items`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("drawing_id", drawing_id);
     

      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      if (data.success === true) {
        return data;
      } else {
        toast.error(data.message || "Failed to fetch material entry items");
        return rejectWithValue(data);
      }
    } catch (error) {
      console.error("Error in getMaterialEntryItems:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getMaterialEntryItemsSlice = createSlice({
  name: "getMaterialEntryItems",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDrawItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterialEntryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialEntryItems.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMaterialEntryItems.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearDrawItems } = getMaterialEntryItemsSlice.actions;

export default getMaterialEntryItemsSlice.reducer;
