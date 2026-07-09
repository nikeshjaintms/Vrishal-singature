import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addCategory = createAsyncThunk(
    '/add/addCategory',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-itemCategory`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addCategory = response.data;
            // console.log(addCategory, '@@@')

            if (addCategory.success === true) {
                toast.success(addCategory?.message);
                return addCategory;
            } else {
                // console.log(addCategory.message, "&&&&")
                throw new Error(addCategory);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addCategorySlice = createSlice({
    name: "addCategory",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addCategorySlice.reducer;