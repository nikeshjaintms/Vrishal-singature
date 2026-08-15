import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addDepartment = createAsyncThunk(
    '/add/addDepartment ',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-department`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addDepartment = response.data;
            // console.log(addDepartment, '@@@')

            if (addDepartment.success === true) {
                toast.success(addDepartment?.message);
                return addDepartment;
            } else {
                // console.log(addDepartment.message, "&&&&")
                throw new Error(addDepartment);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addDepartmentSlice = createSlice({
    name: "addDepartment ",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDepartment.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addDepartment.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addDepartmentSlice.reducer;