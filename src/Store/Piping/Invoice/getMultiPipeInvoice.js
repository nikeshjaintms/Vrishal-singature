import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiPipeInvoice  = createAsyncThunk('/user/getMultiPipeInvoice',
    async () => {
        try {
            const formData = new URLSearchParams();
            const myurl = `${V_URL}/user/piping/get-multi-invoice`;
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

const getMultiPipeInvoiceSlice = createSlice({
    name: "getMultiPipeInvoice",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiPipeInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiPipeInvoice.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiPipeInvoice.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiPipeInvoiceSlice.reducer;