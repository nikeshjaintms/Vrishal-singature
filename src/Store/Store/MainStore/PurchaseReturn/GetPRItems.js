import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getPRItems = createAsyncThunk('/user/list-pu-pur',
    async ({ party_id, bill_no, challan_no }) => {
        try {
            const myurl = `${V_URL}/user/list-pu-pur`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('tag_number', 11)
            bodyFormData.append('party_id', party_id)
            bodyFormData.append('bill_no', bill_no)
            bodyFormData.append('challan_no', challan_no)
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))

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

const getPRItemsSlice = createSlice({
    name: "getPRItems",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPRItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPRItems.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPRItems.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPRItemsSlice.reducer;