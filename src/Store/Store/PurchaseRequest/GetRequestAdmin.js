import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getRequestAdmin = createAsyncThunk('/admin/list-pr',
    async ({ formData }) => {
        try {
            const myurl = `${V_URL}/admin/list-pr`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getPurchaseRequest response");

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            
            // toast.error(error.response.data.message);
            return error
        }
    })
    

const getRequestAdminSlice = createSlice({
    name: "getRequestAdmin",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRequestAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRequestAdmin.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getRequestAdmin.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getRequestAdminSlice.reducer;