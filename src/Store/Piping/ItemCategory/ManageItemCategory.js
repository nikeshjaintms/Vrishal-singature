import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addItemCategory = createAsyncThunk(
    '/add/addItemCategory',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-piping-item-Category`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addItemCategory = response.data;
            // console.log(addCategory, '@@@')

            if (addItemCategory.success === true) {
                toast.success(addItemCategory?.message);
                return addItemCategory;
            } else {
                // console.log(addCategory.message, "&&&&")
                throw new Error(addItemCategory);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addItemCategorySlice = createSlice({
    name: "addItemCategory",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addItemCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemCategory.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addItemCategory.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addItemCategorySlice.reducer;