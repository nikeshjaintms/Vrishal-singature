import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getAdminThickness = createAsyncThunk('/unit/getAdminThickness',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-admin-thickness`;

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

const getAdminThicknessSlice = createSlice({
    name: "getAdminThickness",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminThickness.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminThickness.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminThickness.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminThicknessSlice.reducer;