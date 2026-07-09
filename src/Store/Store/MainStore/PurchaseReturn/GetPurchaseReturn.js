import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPurchaseReturn = createAsyncThunk('/user/list-pur',
    async ({ formData }) => {
        try {
            const myurl = `${V_URL}/user/list-pur`;

            const response = await axios({
                method: 'POST',
                url: myurl,
                data: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });
            const data = response.data;
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

const getPurchaseReturnSlice = createSlice({
    name: "getPurchaseReturn",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseReturn.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseReturn.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPurchaseReturnSlice.reducer;