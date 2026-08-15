import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const manageNDTOfferTable = createAsyncThunk('/issue/manageNDTOfferTable',
    async ({ bodyFormData }) => {
        try {
            const myurl = `${V_URL}/user/manage-ndt-offer-table`;
            const response = await axios({
                method: 'post',
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
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const manageNDTOfferTableSlice = createSlice({
    name: "manageNDTOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(manageNDTOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(manageNDTOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(manageNDTOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default manageNDTOfferTableSlice.reducer;