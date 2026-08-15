import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// export const getMultipleIssueRequest = createAsyncThunk('/issue/getMultipleIssueRequest',
//     async ({limit,page, search}) => {
//         try {
//             const myurl = `${V_URL}/user/get-multi-issue-request?page=${page}&limit=${limit}&search=${search}`;
//             const bodyFormData = new URLSearchParams();
//             bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
//             bodyFormData.append('limit', limit);
//             bodyFormData.append('page', page);
//             const response = await axios({
//                 method: 'post',
//                 url: myurl,
//                 data: bodyFormData,
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
//                 },
//             });

//             const data = response.data;
            
//             if (data.success === true) {
//                 return data;
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             console.log(error, "error");
//             toast.error(error.response.data.message);
//             return error
//         }
//     });


export const getMultipleIssueRequest = createAsyncThunk(
  '/issue/getMultipleIssueRequest',
  async (params = {}, thunkAPI) => {
    try {
      const { page, limit, search } = params;

      // 🔧 Build query string
      const queryParams = new URLSearchParams();
      if (page != null) queryParams.append('page', page);
      if (limit != null) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);

      const queryString = queryParams.toString();
      const myurl = `${V_URL}/user/get-multi-issue-request${queryString ? `?${queryString}` : ''}`;

      // 🔧 Build POST body
      const bodyFormData = new URLSearchParams();
      const projectId = localStorage.getItem('U_PROJECT_ID');
      if (projectId) {
        bodyFormData.append('project', projectId);
      }
      if (page != null) bodyFormData.append('page', page);
      if (limit != null) bodyFormData.append('limit', limit);

      const token = localStorage.getItem('PAY_USER_TOKEN');

      const response = await axios({
        method: 'post',
        url: myurl,
        data: bodyFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.success) {
        return data;
      } else {
        toast.error(data.message || "Something went wrong");
        return thunkAPI.rejectWithValue(data.message || "Unknown error");
      }

    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Request failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const getMultipleIssueRequestSlice = createSlice({
    name: "getMultipleIssueRequest",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultipleIssueRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultipleIssueRequest.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultipleIssueRequest.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultipleIssueRequestSlice.reducer;