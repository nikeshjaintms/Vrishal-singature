import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getNDTOfferTable = createAsyncThunk('/party/getNDTOfferTable',
    async ({ weld_visual_id }) => {
        try {
            const myurl = `${V_URL}/user/get-ndt-offer-table?weld_visual_id=${weld_visual_id}`;
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

const getNDTOfferTableSlice = createSlice({
    name: "getNDTOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNDTOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNDTOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getNDTOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getNDTOfferTableSlice.reducer;