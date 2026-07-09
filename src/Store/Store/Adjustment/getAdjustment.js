import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getAdjustment = createAsyncThunk('/party/getAdjustment',
    async ({ storeType }, { rejectWithValue }) => {
        try {
            const myurl = `${V_URL}/user/get-order-adjustment`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('store_type', storeType)
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            console.log(myurl, response, '#####')
            const data = response.data;
            console.log(data, "getAdjustment response");

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

const getAdjustmentSlice = createSlice({
    name: "getAdjustment",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdjustment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdjustment.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdjustment.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdjustmentSlice.reducer;