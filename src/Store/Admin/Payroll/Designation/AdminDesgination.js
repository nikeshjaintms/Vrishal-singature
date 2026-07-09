import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminDesignation = createAsyncThunk('/designation/getAdminDesignation',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-admin-designation`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const designationData = response.data;
            // console.log(designationData, "getAdminDesignation response");

            if (designationData.success === true) {
                return designationData;
            } else {
                throw new Error(designationData);
            }
        } catch (error) {
            // console.log(error, "error");
            toast.error(error.response.data.message);
            return error;
        }
    })

const getAdminDesignationSlice = createSlice({
    name: "getAdminDesignation",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminDesignation.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminDesignation.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminDesignationSlice.reducer;