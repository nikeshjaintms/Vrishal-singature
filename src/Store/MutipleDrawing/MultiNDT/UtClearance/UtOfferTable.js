import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getMultiUTOfferTable = createAsyncThunk('/party/getMultiUTOfferTable',
    async ({ typeId, masterId }) => {

        try {
            const myurl = `${V_URL}/user/get-ndt-generated-offer?type=${typeId}&ndt_master_id=${masterId}&project=${localStorage.getItem('U_PROJECT_ID')}`;
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

const getMultiUTOfferTableSlice = createSlice({
    name: "getMultiUTOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiUTOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiUTOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiUTOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiUTOfferTableSlice.reducer;