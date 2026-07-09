import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getDesignation = createAsyncThunk('/designation/getDesignation',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-designation`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const designationData = response.data;
            // console.log(designationData, "getDesignation response");

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

const getDesignationSlice = createSlice({
    name: "getDesignation",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDesignation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDesignation.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getDesignation.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getDesignationSlice.reducer;