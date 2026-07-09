import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addDesignation = createAsyncThunk(
    '/add/addDesignation',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-designation`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addDesignation = response.data;
            // console.log(addDesignation, '@@@')

            if (addDesignation.success === true) {
                toast.success(addDesignation?.message);
                return addDesignation;
            } else {
                // console.log(addDesignation.message, "&&&&")
                throw new Error(addDesignation);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addDesignationSlice = createSlice({
    name: "addDesignation",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDesignation.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addDesignation.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addDesignationSlice.reducer;