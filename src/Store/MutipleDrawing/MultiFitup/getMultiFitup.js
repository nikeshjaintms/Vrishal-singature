import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


// export const getMultiFitup = createAsyncThunk(
//   "/party/getMultiFitup",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const proId = localStorage.getItem("U_PROJECT_ID");

//       let { page, limit } = params;
//       page = page ?? 1;
//       limit = limit ?? 10;

//       const myurl = `${V_URL}/user/get-multi-fitup?page=${page}&limit=${limit}&project=${proId}`;
         
//       const response = await axios({
//         method: "get",
//         url: myurl,
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       const data = response.data;

//       if (data.success === true) {
//         return data;
//       } else {
//         return rejectWithValue(data);
//       }
//     } catch (error) {
//       console.log(error, "error");
//       toast.error(error.response?.data?.message || "Something went wrong");
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const getMultiFitup = createAsyncThunk(
  "/party/getMultiFitup",
  async (params = {}, { rejectWithValue }) => {
    try {
      const proId = localStorage.getItem("U_PROJECT_ID");
      const { page, limit , search } = params;

      // Build query string dynamically
      const queryParams = new URLSearchParams();
      if (page != null) queryParams.append("page", page);
      if (limit != null) queryParams.append("limit", limit);
       if (search != null) queryParams.append("search", search);
      queryParams.append("project", proId);

      const myurl = `${V_URL}/user/get-multi-fitup?${queryParams.toString()}`;

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

const getMultiFitupSlice = createSlice({
    name: "getMultiFitup",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiFitup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiFitup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiFitup.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiFitupSlice.reducer;