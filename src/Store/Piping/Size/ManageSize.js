import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addSize = createAsyncThunk(
    '/add/addSize',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-size`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addSize = response.data;

            if (addSize.success === true) {
                toast.success(addSize?.message);
                return addSize;
            } else {
                throw new Error(addSize);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addSizeSlice = createSlice({
    name: "addSize",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addSize.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSize.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addSize.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addSizeSlice.reducer;