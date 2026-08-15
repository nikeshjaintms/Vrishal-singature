import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getBank = createAsyncThunk('/bank/getBank',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-bank`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const bankData = response.data;
            // console.log(bankData, "getBank response");

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

const getBankSlice = createSlice({
    name: "getBank",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBank.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBank.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getBank.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getBankSlice.reducer;