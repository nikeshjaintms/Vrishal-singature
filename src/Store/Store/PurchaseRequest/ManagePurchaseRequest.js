import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const ManagePurchaseRequest = createAsyncThunk('/user/add-one-pr',
    async (payload) => {
        try {
            const myurl = `${V_URL}/user/add-one-pr`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: payload,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });
            const data = response.data;
            if (data.success === true) {
                toast.success(response.data.message);
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            
            toast.error(error.response.data.message);
            return error
        }
    })
const AddPurchaseRequestSlice = createSlice({
    name: "AddPurchaseRequest",
    initialState: {
        user: null,
        message: '',
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ManagePurchaseRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ManagePurchaseRequest.fulfilled, (state, action) => {
                state.message = action.payload.message
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(ManagePurchaseRequest.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})
export default AddPurchaseRequestSlice.reducer;