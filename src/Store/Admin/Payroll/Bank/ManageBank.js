import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addBank = createAsyncThunk(
    '/add/addBank',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-bank`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addBank = response.data;
            // console.log(addBank, '@@@')

            if (addBank.success === true) {
                toast.success(addBank?.message);
                return addBank;
            } else {
                // console.log(addBank.message, "&&&&")
                throw new Error(addBank);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addBankSlice = createSlice({
    name: "addBank",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBank.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addBank.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addBankSlice.reducer;