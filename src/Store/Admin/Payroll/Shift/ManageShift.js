import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addShift = createAsyncThunk(
    '/add/addShift',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-shift`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addShift = response.data;
            // console.log(addShift, '@@@')

            if (addShift.success === true) {
                toast.success(addShift?.message);
                return addShift;
            } else {
                // console.log(addShift.message, "&&&&")
                throw new Error(addShift);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addShiftSlice = createSlice({
    name: "addShift",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addShift.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addShift.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addShiftSlice.reducer;