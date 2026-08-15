import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPurchaseReciecing = createAsyncThunk('/user/list-pu',
    async ({ formData }) => {
        try {
            const myurl = `${V_URL}/user/list-pu`;

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

const getPurchaseRecievingSlice = createSlice({
    name: "getPurchaseReciecing",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseReciecing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseReciecing.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseReciecing.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPurchaseRecievingSlice.reducer;