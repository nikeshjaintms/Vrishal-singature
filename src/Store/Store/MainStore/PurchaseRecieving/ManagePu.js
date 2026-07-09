import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addPu = createAsyncThunk(
    '/add/addPuItem',
    async (add) => {
        console.log(add, "ADD");
        try {
            const myurl = `${V_URL}/user/add-one-pu`;
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
const AddPuSlice = createSlice({
    name: "addPuItem",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPu.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPu.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addPu.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default AddPuSlice.reducer;