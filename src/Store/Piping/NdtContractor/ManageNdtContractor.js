import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addNdtContractor = createAsyncThunk(
    '/add/addNdtContractor',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-ndt-contractor`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addSize = response.data;

            if (addSize.success === true) {
                toast.success(addSize?.message);
                return addSize;
            } else {
                throw new Error(addSize);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addNdtContractorSlice = createSlice({
    name: "addNdtContractor",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addNdtContractor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNdtContractor.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addNdtContractor.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addNdtContractorSlice.reducer;