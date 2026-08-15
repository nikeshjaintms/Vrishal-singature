import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getUserEmployee = createAsyncThunk('/employee/getUserEmployee',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-employee`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error
        }
    })

const getUserEmployeeSlice = createSlice({
    name: "getUserEmployee",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserEmployee.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserEmployee.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserEmployeeSlice.reducer;