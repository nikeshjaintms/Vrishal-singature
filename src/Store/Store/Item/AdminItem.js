import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// export const getAdminItem = createAsyncThunk(
//   "/party/getAdminItem",
//   async ({ is_main }) => {
//     try {
//       const projectId = localStorage.getItem("U_PROJECT_ID");
//       const myurl = `${V_URL}/user/get-admin-item?is_main=${is_main}&project=${
//         !is_main ? projectId : ""
//       }`;

//       const response = await axios({
//         method: "get",
//         url: myurl,
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       const data = response.data;
//       // console.log( data, "getAdminItem response");

//       if (data.success === true) {
//         return data;
//       } else {
//         throw new Error(data);
//       }
//     } catch (error) {
//       console.log(error, "error");
//       toast.error(error.response.data.message);
//       return error;
//     }
//   }
// );


export const getAdminItem = createAsyncThunk(
  "/party/getAdminItem",
  async ({ is_main, currentPage, limit, search }) => {
    try {
      const projectId = localStorage.getItem("U_PROJECT_ID");
      
      // Build dynamic query params
      const queryParams = new URLSearchParams();
      if (is_main) queryParams.append("is_main", is_main);
      if (!is_main && projectId) queryParams.append("project", projectId);
      if (currentPage) queryParams.append("currentPage", currentPage);
      if (limit) queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);

      const myurl = `${V_URL}/user/get-admin-item?${queryParams.toString()}`;

      const response = await axios.get(myurl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;
      // console.log(data, "getAdminItem response");

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch item data");
      }
    } catch (error) {
      console.error(error, "error");
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      return Promise.reject(error);
    }
  }
);


const getAdminItemSlice = createSlice({
  name: "getAdminItem",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminItem.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAdminItem.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAdminItemSlice.reducer;
