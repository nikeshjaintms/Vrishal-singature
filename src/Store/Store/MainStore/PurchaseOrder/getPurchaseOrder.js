import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPurchaseOrder = createAsyncThunk('/user/list-po',
    async ({ formData }) => {
        try {
            const myurl = `${V_URL}/user/list-po`;

            const response = await axios({
                method: 'POST',
                url: myurl,
                data: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getOrder response");

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

const getPurchaseOrderSlice = createSlice({
    name: "getPurchaseOrder",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseOrder.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseOrder.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPurchaseOrderSlice.reducer;