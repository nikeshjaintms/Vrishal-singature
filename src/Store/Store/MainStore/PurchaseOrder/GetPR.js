import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getVoucherNo = createAsyncThunk('/user/list-pr-no',
    async () => {
        try {
            const myurl = `${V_URL}/user/list-pr-no`;

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('tag_number', 9)
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))

            const response = await axios({
                method: 'POST',
                url: myurl,
                data: bodyFormData,
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

            toast.error(error.response.data.message);
            return error
        }
    })

const getPrSlice = createSlice({
    name: "getPr",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVoucherNo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVoucherNo.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getVoucherNo.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPrSlice.reducer;