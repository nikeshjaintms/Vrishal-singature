import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const adminForgetPassword = createAsyncThunk(
    '/login/adminForgetPassword',
    async (forget, { rejectWithValue }) => {
        try {
            const myurl = `${V_URL}/admin/forgot-password`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', forget || localStorage.getItem('VA_FORGET_EMAIL'));

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })

            const forgetData = response.data;

            if (forgetData.success === true) {
                toast.success(forgetData.message)
                console.log(forgetData)
                return forgetData;
            } else {
                throw new Error(forgetData.message);
            }
        } catch (error) {
            console.log(error, 'Error');
            toast.error(error?.response?.data?.message || 'Something went worng');
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


const adminForgetPasswordSlice = createSlice({
    name: "adminForgetPassword",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminForgetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminForgetPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminForgetPassword.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default adminForgetPasswordSlice.reducer;