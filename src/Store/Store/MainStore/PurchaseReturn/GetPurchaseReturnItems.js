import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPurchaseReturnItems = createAsyncThunk('/user/one-pur',
    async ({ id }) => {
        try {
            const myurl = `${V_URL}/user/one-pur`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('id', id)
            const response = await axios({
                method: 'POST',
                url: myurl,
                data: bodyFormData,
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

const getPurchaseReturnItemsSlice = createSlice({
    name: "getPurchaseReturnItems",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseReturnItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseReturnItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseReturnItems.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPurchaseReturnItemsSlice.reducer;