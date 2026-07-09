import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const updateNDTOfferTable = createAsyncThunk('/issue/updateNDTOfferTable',
    async ({ updatedData }) => {
        try {
            const myurl = `${V_URL}/user/update-ndt-offer-table`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: updatedData,
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

const updateNDTOffTableSlice = createSlice({
    name: "updateNDTOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateNDTOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNDTOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateNDTOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default updateNDTOffTableSlice.reducer;