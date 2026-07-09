import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminBank = createAsyncThunk('/bank/getAdminBank',
    async (bank) => {
        try {
            const myurl = `${V_URL}/admin/get-admin-bank`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const bankData = response.data;
            // console.log(bankData, "getAdminBank response");

            if (bankData.success === true) {
                return bankData;
            } else {
                throw new Error(bankData);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getAdminBankSlice = createSlice({
    name: "getAdminBank",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminBank.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminBank.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminBankSlice.reducer;