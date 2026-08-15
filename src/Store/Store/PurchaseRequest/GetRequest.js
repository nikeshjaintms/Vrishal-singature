import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPurchaseRequest = createAsyncThunk('/user/list-pr',
    async ({ formData }) => {
        try {
            const myurl = `${V_URL}/user/list-pr`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getPurchaseRequest response");

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            
            // toast.error(error.response.data.message);
            return error
        }
    })

const getRequestSlice = createSlice({
    name: "getPurchaseRequest",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseRequest.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPurchaseRequest.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getRequestSlice.reducer;