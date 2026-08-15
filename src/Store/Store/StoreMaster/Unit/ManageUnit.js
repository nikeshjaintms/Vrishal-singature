import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addUnit = createAsyncThunk(
    '/add/addUnit',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-unit`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addUnit = response.data;

            if (addUnit.success === true) {
                toast.success(addUnit?.message);
                return addUnit;
            } else {
                throw new Error(addUnit);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addUnitSlice = createSlice({
    name: "addUnit",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addUnit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUnit.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addUnit.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addUnitSlice.reducer;