import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addGroup = createAsyncThunk(
    '/add/addGroup',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-group`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addGroup = response.data;
            // console.log(addGroup, '@@@')

            if (addGroup.success === true) {
                toast.success(addGroup?.message);
                return addGroup;
            } else {
                // console.log(addGroup.message, "&&&&")
                throw new Error(addGroup);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addGroupSlice = createSlice({
    name: "addGroup",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addGroup.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addGroupSlice.reducer;