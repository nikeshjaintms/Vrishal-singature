import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addPo = createAsyncThunk(
    '/add/addItem',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/add-one-po`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addItem = response.data;
            // console.log(addItem, '@@@')

            if (addItem.success === true) {
                toast.success(addItem?.message);
                return addItem;
            } else {
                // console.log(addItem.message, "&&&&")
                throw new Error(addItem);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const AddOrderSlice = createSlice({
    name: "addItem",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPo.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addPo.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default AddOrderSlice.reducer;