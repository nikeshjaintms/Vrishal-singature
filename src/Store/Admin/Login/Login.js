import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const adminLogin = createAsyncThunk(
    '/login/adminLogin',
    async (login, { rejectWithValue }) => {
        try {
            const myurl = `${V_URL}/admin/login`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', login.email);
            bodyFormData.append('password', login.password);

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const loginData = response.data;

            if (loginData.success === true) {
                localStorage.setItem('VA_TOKEN', loginData?.data?.token);
                localStorage.setItem('VA_NAME', loginData?.data?.name);
                localStorage.setItem('VA_IMG', loginData?.data?.image);
                toast.success(loginData?.message);
                return loginData;
            } else {
                throw new Error(loginData.message);
            }
        } catch (error) {
            console.log(error, 'Error');
            toast.error(error.response.data.message || 'Something went wrong');
            return rejectWithValue(error.response.data.message);
        }
    }
);


const adminLoginSlice = createSlice({
    name: "login",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default adminLoginSlice.reducer;