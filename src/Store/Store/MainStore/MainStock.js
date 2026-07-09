import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMainStoreStock = createAsyncThunk('/issue/getMainStoreStock',
    async ({ itemId }) => {
        try {
            const myurl = `${V_URL}/user/ms-stockitem`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('itemId', itemId)
            bodyFormData.append('firm_id', localStorage.getItem("PAY_USER_FIRM_ID"))
            // bodyFormData.append('year_id', localStorage.getItem("PAY_USER_YEAR_ID"))
            const response = await axios({
                method: 'post',
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

const getMainStoreStockSlice = createSlice({
    name: "getMainStoreStock",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMainStoreStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMainStoreStock.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMainStoreStock.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMainStoreStockSlice.reducer;