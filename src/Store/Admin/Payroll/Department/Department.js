import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getDepartment = createAsyncThunk('/department/getDepartment',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-department`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const departmentData = response.data;
            // console.log(departmentData, "getDepartment response");

            if (departmentData.success === true) {
                return departmentData;
            } else {
                throw new Error(departmentData);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getDepartmentSlice = createSlice({
    name: "getDepartment",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDepartment.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getDepartment.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getDepartmentSlice.reducer;