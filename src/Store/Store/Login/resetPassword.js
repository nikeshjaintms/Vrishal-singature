import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const resetUserPassword = createAsyncThunk('/change/resetUserPassword',
    async (change) => {
        try {
            const myurl = `${V_URL}/user/reset-password`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('email', localStorage.getItem('U_FORGET_EMAIL'))
            bodyFormData.append('new_password', change?.password);

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
            toast.error(error?.response?.data?.message);
            return error;
        }
    }
)

const resetUserPasswordSlice = createSlice({
    name: "resetUserPassword",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default resetUserPasswordSlice.reducer;