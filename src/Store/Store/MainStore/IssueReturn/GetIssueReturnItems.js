import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getIssueReturnItems = createAsyncThunk('/user/one-isr',
    async (payload) => {
        try {
            const myurl = `${V_URL}/user/one-isr`;
            const response = await axios({
                method: 'POST',
                url: myurl,
                data: payload,
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

const getIssueReturnItemsSlice = createSlice({
    name: "getIssueReturnItems",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueReturnItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReturnItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueReturnItems.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueReturnItemsSlice.reducer;