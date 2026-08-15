import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getMultiNdtOffer = createAsyncThunk('/issue/getMultiNdtOffer',
    async ({ status, type }) => {
        const projectId = localStorage.getItem('U_PROJECT_ID')
        try {
            const myurl = `${V_URL}/user/get-ndt-typewise-offer?status=${status}&type=${type}&project=${projectId}`;
            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getMultiNdtOffer response");
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

const getMultiNdtOfferSlice = createSlice({
    name: "getMultiNdtOffer",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiNdtOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiNdtOffer.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiNdtOffer.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiNdtOfferSlice.reducer;