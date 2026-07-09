import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addErpRole = createAsyncThunk(
    '/add/addErpRole',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-erprole`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addErpRole = response.data;
            // console.log(addErpRole, '@@@')

            if (addErpRole.success === true) {
                toast.success(addErpRole?.message);
                return addErpRole;
            } else {
                // console.log(addErpRole.message, "&&&&")
                throw new Error(addErpRole);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addErpRoleSlice = createSlice({
    name: "addErpRole",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addErpRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addErpRole.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addErpRole.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addErpRoleSlice.reducer;