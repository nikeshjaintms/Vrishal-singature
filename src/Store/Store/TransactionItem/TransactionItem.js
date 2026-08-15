import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getTransactionItem = createAsyncThunk('/party/getTransactionItem',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-transaction-item`;

            const response = await axios({
                method: 'post',
                url: myurl,
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

const getTransactionItemSlice = createSlice({
    name: "getTransactionItem",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransactionItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactionItem.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getTransactionItem.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getTransactionItemSlice.reducer;