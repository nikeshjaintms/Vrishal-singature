import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// export const getAdminParty = createAsyncThunk(
//   "/party/getAdminParty",
//   async ({ storeType, is_main, currentPage, limit, search }) => {
//     try {
//       const myurl = `${V_URL}/user/get-admin-party?currentPage=${currentPage}&limit=${limit}&search=${search}`;

//       const bodyFormData = new URLSearchParams();
//       if (!is_main) {
//         bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
//       }
//       bodyFormData.append("store_type", storeType);
//       bodyFormData.append("is_admin", false);
//       bodyFormData.append("currentPage", currentPage);
//       bodyFormData.append("limit", limit);
//       bodyFormData.append("search", search);
      
//       const response = await axios({
//         method: "post",
//         url: myurl,
//         data: bodyFormData,
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       const data = response.data;
//       console.log(data, "getAdminParty response");

//       if (data.success === true) {
//         return data;
//       } else {
//         throw new Error(data);
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//       return error;
//     }
//   }
// );

export const getAdminParty = createAsyncThunk(
  "/party/getAdminParty",
  async ({ storeType, is_main, currentPage, limit, search }) => {
    try {
     

      const myurl = `${V_URL}/user/get-admin-party`;

      const bodyFormData = new URLSearchParams();
      if (!is_main) {
        bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
      }
      if (storeType) bodyFormData.append("store_type", storeType);

      // is_admin seems always false here
      bodyFormData.append("is_admin", false);

      // Only add these if they have values
      if (currentPage) bodyFormData.append("currentPage", currentPage);
      if (limit) bodyFormData.append("limit", limit);
      if (search) bodyFormData.append("search", search);

      const response = await axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      console.log(data, "getAdminParty response");

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch admin party");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      return Promise.reject(error);
    }
  }
);


const getAdminPartySlice = createSlice({
  name: "getAdminParty",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminParty.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminParty.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminPartySlice.reducer;
