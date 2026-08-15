import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMaterialEntryItemsForIssueReturn = createAsyncThunk(
  "/issue/getMaterialEntryItemsForIssueReturn",
  async ({drawing_id }, { rejectWithValue }) => { 
    try {
      const myurl = `${V_URL}/user/get-material-issue-return-piping`;

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
      console.error("Error in getMaterialEntryItemsForIssueReturn:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getMaterialEntryItemsForIssueReturnSlice = createSlice({
  name: "getMaterialEntryItemsForIssueReturn",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMaterialEntryForIssueReturnItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterialEntryItemsForIssueReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialEntryItemsForIssueReturn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMaterialEntryItemsForIssueReturn.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearMaterialEntryForIssueReturnItems } = getMaterialEntryItemsForIssueReturnSlice.actions;

export default getMaterialEntryItemsForIssueReturnSlice.reducer;
