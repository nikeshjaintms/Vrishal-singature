import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const resetAdminPassword = createAsyncThunk('/change/resetAdminPassword',
    async (change) => {
        try {
            const myurl = `${V_URL}/admin/reset-password`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', localStorage.getItem('VA_FORGET_EMAIL'))
            bodyFormData.append('password', change?.password);

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const changeData = response.data;

            if (changeData.success === true) {
                toast.success(changeData?.message);
                return changeData;
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error?.response?.data?.message || 'Something went worng');
            return error;
        }
    }
)

const resetAdminPasswordSlice = createSlice({
    name: "resetAdminPassword",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetAdminPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetAdminPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(resetAdminPassword.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default resetAdminPasswordSlice.reducer;