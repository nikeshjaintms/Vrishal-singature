import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

export const transactionReturn = createAsyncThunk('/user/add-ms-transaction',
    async ( formData ) => {
        try {
            const myurl = `${V_URL}/user/add-ms-transaction`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: formData,
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
            // toast.error(error.response.data.message);
            return error
        }
    })

const transactionReturnSlice = createSlice({
    name: "transactionReturn",
    initialState: {
        user: null,
        loading: false,                                      
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(transactionReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(transactionReturn.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(transactionReturn.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default transactionReturnSlice.reducer;