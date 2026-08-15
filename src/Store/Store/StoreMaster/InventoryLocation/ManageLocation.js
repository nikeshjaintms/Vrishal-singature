import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addLocation = createAsyncThunk(
    '/add/addLocation',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-inventoryLocation`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addLocation = response.data;

            if (addLocation.success === true) {
                toast.success(addLocation?.message);
                return addLocation;
            } else {
                throw new Error(addLocation);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addLocationSlice = createSlice({
    name: "addLocation",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addLocation.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addLocation.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addLocationSlice.reducer;