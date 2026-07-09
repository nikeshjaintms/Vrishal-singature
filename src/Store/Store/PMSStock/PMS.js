import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPmsStock = createAsyncThunk(
    '/user/get-pms-dashboard',
    async () => {
        try {
            const formdata = new URLSearchParams()
            formdata.append('project', localStorage.getItem("U_PROJECT_ID"))
            const myurl = `${V_URL}/user/get-pms-dashboard`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: formdata,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const PMS = response.data;

            if (PMS.success === true) {
                // toast.success(PMS?.message);
                return PMS;
            } else {
                throw new Error(PMS);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);
const getPmsStockSlice = createSlice({
    name: "getpms",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPmsStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPmsStock.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPmsStock.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPmsStockSlice.reducer;