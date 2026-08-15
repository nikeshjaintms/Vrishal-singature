import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPu = createAsyncThunk('user/list-po-item-pu',
    async (Payload) => {
        try {
            const myurl = `${V_URL}/user/list-po-item-pu`;
            const response = await axios({
                method: 'POST',
                url: myurl,
                data: Payload,
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

const getPoItemsSlice = createSlice({
    name: "getPoItems",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPoItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPoItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPoItems.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPoItemsSlice.reducer;