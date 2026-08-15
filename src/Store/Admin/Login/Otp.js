import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const adminOtp = createAsyncThunk(
    '/login/adminOtp',
    async (otp, { rejectWithValue }) => {

        try {
            const myurl = `${V_URL}/admin/verify-otp`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', localStorage.getItem('VA_FORGET_EMAIL'));
            bodyFormData.append('otp', otp?.otp_data);

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const otpData = response.data;
            // console.log(otpData, '@@@')

            if (otpData.success === true) {
                toast.success(otpData?.message);
                return otpData;
            }
        } catch (error) {
            console.log(error, "Error");
            toast.error(error.response.data.message || 'Something went worng');
            return error;
        }
    }
);



const adminOtpSlice = createSlice({
    name: "adminOtp",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminOtp.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminOtp.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default adminOtpSlice.reducer;
