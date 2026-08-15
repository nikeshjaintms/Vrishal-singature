import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addYear = createAsyncThunk(
    '/add/addYear',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-year`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addYear = response.data;
            // console.log(addYear, '@@@')

            if (addYear.success === true) {
                toast.success(addYear?.message);
                return addYear;
            } else {
                // console.log(addYear.message, "&&&&")
                throw new Error(addYear);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addYearSlice = createSlice({
    name: "addYear",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addYear.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addYear.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addYear.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addYearSlice.reducer;