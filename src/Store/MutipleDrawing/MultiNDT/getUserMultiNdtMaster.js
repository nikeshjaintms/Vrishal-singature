import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// export const getUserMultiNdtMaster = createAsyncThunk('/issue/getUserMultiNdtMaster',
//     async ({ status }) => {
//         try {
//             const proId = localStorage.getItem('U_PROJECT_ID');
//             const myurl = `${V_URL}/user/get-multi-ndt-master?project=${proId}&status=${status}`;
//             const response = await axios({
//                 method: 'get',
//                 url: myurl,
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
//                 },
//             });

//             const data = response.data;
//             // console.log(data, "getUserMainNdtMaster response");
//             if (data.success === true) {
//                 return data;
//             } else {
//                 throw new Error(data);
//             }
//         } catch (error) {
            
//             toast.error(error.response.data.message);
//             return error
//         }
//     })


export const getUserMultiNdtMaster = createAsyncThunk(
    '/issue/getUserMultiNdtMaster',
    async ({ status, currentPage, limit, search}, { rejectWithValue }) => {
        try {
            const proId = localStorage.getItem('U_PROJECT_ID');
            const token = localStorage.getItem('PAY_USER_TOKEN');

            // Construct query string dynamically
            const queryParams = new URLSearchParams();

            if (proId) queryParams.append("project", proId);
            if (status) queryParams.append("status", status);
            if (currentPage) queryParams.append("currentPage", currentPage);
            if (limit) queryParams.append("limit", limit);
            if (search) queryParams.append("search", search);

            const myurl = `${V_URL}/user/get-multi-ndt-master?${queryParams.toString()}`;

            const response = await axios.get(myurl, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = response.data;

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data.message || "Failed to fetch");
            }
        } catch (error) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const getUserMultiNdtMasterSlice = createSlice({
    name: "getUserMultiNdtMaster",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserMultiNdtMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserMultiNdtMaster.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserMultiNdtMaster.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserMultiNdtMasterSlice.reducer;






