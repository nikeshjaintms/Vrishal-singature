import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserContractor = createAsyncThunk('/issue/getUserContractor',
    async ({ status , project_id = "" }) => {
        try {
            console.log(status, project_id, "getUserContractor params");
            const queryParams = [];
            if (status) {
                queryParams.push(`status=${status}`);
            }
            if (project_id) {
                queryParams.push(`project_id=${project_id}`);
            }
            const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

            const myurl = `${V_URL}/user/get-contractor${query}`;
            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserContractor response");
            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getUserContractorSlice = createSlice({
    name: "getUserContractor",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserContractor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserContractor.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserContractor.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserContractorSlice.reducer;