import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getItemLedger = createAsyncThunk('/party/getItemLedger',
    async (bodyFormData) => {
        try {
            const myurl = `${V_URL}/user/legder-list`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
                },
            });

            const data = response.data;
            // console.log(data, "getItemLedger response");

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

const getItemLedgerSlice = createSlice({
    name: "getItemLedger",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getItemLedger.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getItemLedger.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getItemLedger.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getItemLedgerSlice.reducer;