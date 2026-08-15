import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getMultiMPTOfferTable = createAsyncThunk('/party/getMultiMPTOfferTable',
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

const getMultiMPTOfferTableSlice = createSlice({
    name: "getMultiMPTOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiMPTOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiMPTOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiMPTOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiMPTOfferTableSlice.reducer;