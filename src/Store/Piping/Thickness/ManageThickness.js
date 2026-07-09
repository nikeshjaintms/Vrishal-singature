import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addThickness = createAsyncThunk(
    '/add/addThickness',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-thickness`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addThickness = response.data;

            if (addThickness.success === true) {
                toast.success(addThickness?.message);
                return addThickness;
            } else {
                throw new Error(addThickness);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addThicknessSlice = createSlice({
    name: "addThickness",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addThickness.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addThickness.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addThickness.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addThicknessSlice.reducer;