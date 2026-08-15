import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";



export const userForgetPassword = createAsyncThunk(
    '/login/userForgetPassword',
    async (forget, { rejectWithValue }) => {
        try {
            const myurl = `${V_URL}/user/forget-password`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', forget || localStorage.getItem('U_FORGET_EMAIL'));

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
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);


const userForgetPasswordSlice = createSlice({
    name: "userForgetPassword",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userForgetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userForgetPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(userForgetPassword.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default userForgetPasswordSlice.reducer;