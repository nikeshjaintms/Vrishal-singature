import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getParty = createAsyncThunk(
  "/party/getParty",
  async ({ storeType, is_main }) => {
    try {
      const myurl = `${V_URL}/user/get-party`;

      const bodyFormData = new URLSearchParams();
      if (!is_main) {
        const project = localStorage.getItem("U_PROJECT_ID");
        bodyFormData.append("project", project);
      }
      bodyFormData.append("store_type", storeType);
      bodyFormData.append("is_admin", false);

      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getParty response");

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return error;
    }
  }
);

const getPartySlice = createSlice({
  name: "getParty",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParty.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getParty.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPartySlice.reducer;
