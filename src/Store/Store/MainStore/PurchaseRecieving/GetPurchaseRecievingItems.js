import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPurchaseReciecingItems = createAsyncThunk('/user/one-pu',
    async ({ id }) => {
        try {
            const myurl = `${V_URL}/user/one-pu`;
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

const getPurchaseRecievingItemsSlice = createSlice({
    name: "getPurchaseReciecingItems",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseReciecingItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseReciecingItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseReciecingItems.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPurchaseRecievingItemsSlice.reducer;