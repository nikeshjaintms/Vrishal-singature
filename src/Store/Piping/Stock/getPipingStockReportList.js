import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingStockReportList = createAsyncThunk('/party/getPipingStockReportList',
    async (args = {}) => {
        const { page, limit, search } = args;
        try {
            const projectId = localStorage.getItem('U_PROJECT_ID');
            const params = new URLSearchParams();

            if (projectId) params.append('project', projectId);
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
            if (search) params.append('search', search);

            const myurl = `${V_URL}/user/piping-get-stock-list?${params.toString()}`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            console.log("getPipingStockReportList API response:", data);
            console.log("Data array:", data?.data, "Length:", data?.data?.length);

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {

            toast.error(error.response.data.message);
            return error
        }
    })

const getPipingStockReportListSlice = createSlice({
    name: "getPipingStockReportList",
    initialState: {
        user: null,
        data: [], // Initialize data as empty array
         pagination: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPipingStockReportList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPipingStockReportList.fulfilled, (state, action) => {
                // Save both the entire payload and just the data array for easier access
                state.user = action.payload;
                state.data = action.payload?.data || [];
                state.pagination = action.payload?.data?.pagination || {};
                state.loading = false;
                state.error = null;
            })
            .addCase(getPipingStockReportList.rejected, (state, action) => {
                state.user = null;
                state.data = []; // Reset data on error
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPipingStockReportListSlice.reducer;