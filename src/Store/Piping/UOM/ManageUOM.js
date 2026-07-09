import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addUOM = createAsyncThunk(
    '/add/addUOM',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-uom`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addUOM = response.data;

            if (addUOM.success === true) {
                toast.success(addUOM?.message);
                return addUOM;
            } else {
                throw new Error(addUOM);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addUOMSlice = createSlice({
    name: "addUOM",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addUOM.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUOM.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addUOM.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addUOMSlice.reducer;