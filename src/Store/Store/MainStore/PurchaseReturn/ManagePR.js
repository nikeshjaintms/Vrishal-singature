import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addPR = createAsyncThunk(
    '/user/add-one-pur',
    async (add) => {
        try {
            const myurl = `${V_URL}/user/add-one-pur`;
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
const addPRSlice = createSlice({
    name: "addPuItem",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPR.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPR.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addPR.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addPRSlice.reducer;