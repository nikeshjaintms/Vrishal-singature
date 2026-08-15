import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultipleIssueAcc = createAsyncThunk('/issue/getMultipleIssueAcc',
    async (params = {}) => {
        try {
               const { page, limit, search  } = params;
            // const myurl = `${V_URL}/user/get-multi-issue-acceptance?page=${page}&limit=${limit}`;

             const queryParams = new URLSearchParams();
      if (page !== undefined && page !== null) queryParams.append('page', page);
      if (limit !== undefined && limit !== null) queryParams.append('limit', limit);
       if (search !== undefined && search !== null) queryParams.append('search', search);
        //    if (search) queryParams.append("search", search);
//   if (search !== undefined && search !== null) queryParams.append('search', search);
      //  add query only if not empty
      const queryString = queryParams.toString();
      const myurl = `${V_URL}/user/get-multi-issue-acceptance${queryString ? `?${queryString}` : ''}`;

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
             if (page !== undefined) bodyFormData.append('page', page);
             if (limit !== undefined) bodyFormData.append('limit', limit);
            // if(search !== undefined) bodyFormData.append('search', search);
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            if (data.success === true) {
                return data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const getMultipleIssueAccSlice = createSlice({
    name: "getMultipleIssueAcc",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultipleIssueAcc.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultipleIssueAcc.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultipleIssueAcc.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultipleIssueAccSlice.reducer;