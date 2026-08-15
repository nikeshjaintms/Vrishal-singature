import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getFitupOfferTable = createAsyncThunk('/party/getFitupOfferTable',
    async ({ issue_id }) => {
        try {
            const myurl = `${V_URL}/user/get-fitup-offer-table?issue_id=${issue_id}`;
            const response = await axios({
                method: 'get',
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
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const getFitupOfferTableSlice = createSlice({
    name: "getFitupOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFitupOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFitupOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFitupOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getFitupOfferTableSlice.reducer;