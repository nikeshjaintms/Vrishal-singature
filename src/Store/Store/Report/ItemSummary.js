import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getItemSummary = createAsyncThunk('/party/getItemSummary',
    async (bodyFormData) => {
        try {
            const myurl = `${V_URL}/user/item-summary-list`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
                },
            });

            const data = response.data;
            // console.log(data, "getItemSummary response");

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

const getItemSummarySlice = createSlice({
    name: "getItemSummary",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getItemSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getItemSummary.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getItemSummary.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getItemSummarySlice.reducer;