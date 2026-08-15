import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addEmployeeType = createAsyncThunk(
    '/add/addEmployeeType',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-employee-type`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addEmployeeType = response.data;
            // console.log(addEmployeeType, '@@@')

            if (addEmployeeType.success === true) {
                toast.success(addEmployeeType?.message);
                return addEmployeeType;
            } else {
                // console.log(addEmployeeType.message, "&&&&")
                throw new Error(addEmployeeType);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addEmployeeTypeSlice = createSlice({
    name: "addEmployeeType",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addEmployeeType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEmployeeType.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addEmployeeType.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addEmployeeTypeSlice.reducer;