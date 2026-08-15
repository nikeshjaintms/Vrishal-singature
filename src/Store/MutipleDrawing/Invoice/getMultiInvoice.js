import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiInvoice = createAsyncThunk('/user/getMultiInvoice',
    async () => {
        try {
            const formData = new URLSearchParams();
            const myurl = `${V_URL}/user/get-multi-invoice`;
            formData.append('pId', localStorage.getItem('U_PROJECT_ID'))
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
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getMultiInvoiceSlice = createSlice({
    name: "getMultiInvoice",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiInvoice.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiInvoice.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiInvoiceSlice.reducer;