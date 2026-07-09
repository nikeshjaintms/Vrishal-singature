import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ================= GET CLIENT MULTI FITUP ================= */
// export const getClientMultiFitup = createAsyncThunk(
//   "/party/getClientMultiFitup",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const proId = localStorage.getItem("U_PROJECT_ID");

//       const {
//         page = 1,
//         limit = 10,
//         search = ""
//       } = params;

//       // Build query params
//       const queryParams = new URLSearchParams();
//       queryParams.append("page", page);
//       queryParams.append("limit", limit);
//       queryParams.append("search", search);
//       queryParams.append("project", proId);

//       const myurl = `${V_URL}/party/get-multi-fitup`;

//       const response = await axios({
//         method: "GET",
//         data: {queryParams},
//         url: myurl,
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       if (response?.data?.success === true) {
//         return response.data;
//       }

//       return rejectWithValue(response.data);
//     } catch (error) {
//       console.error("Client Multi Fitup Error:", error);
//       toast.error(error.response?.data?.message || "Something went wrong");
//       return rejectWithValue(
//         error.response?.data || error.message
//       );
//     }
//   }
// );

export const getClientMultiFitup = createAsyncThunk(
  "/party/getClientMultiFitup",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("PARTY_TOKEN");
      const proId = localStorage.getItem("PARTY_PROJECT_ID");

      if (!token) {
        throw new Error("Token missing, please login again");
      }

      const myurl = `${V_URL}/party/get-multi-fitup-view`;

      const response = await axios.get(myurl, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          project: proId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


/* ================= SLICE ================= */
const getClientMultiFitupSlice = createSlice({
  name: "getClientMultiFitup",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClientMultiFitup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientMultiFitup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getClientMultiFitup.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default getClientMultiFitupSlice.reducer;
