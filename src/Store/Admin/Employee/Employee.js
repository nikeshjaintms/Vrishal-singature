import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const adminGetEmployee = createAsyncThunk('/party/adminGetEmployee',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-employee`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "adminGetEmployee response");

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error;
        }
    })

const adminGetEmployeeSlice = createSlice({
    name: "adminGetEmployee",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminGetEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetEmployee.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminGetEmployee.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default adminGetEmployeeSlice.reducer;