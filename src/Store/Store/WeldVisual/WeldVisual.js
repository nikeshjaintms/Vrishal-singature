import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserWeldVisual = createAsyncThunk('/issue/getUserWeldVisual',
    async ({ status }) => {
        try {
            const myurl = `${V_URL}/user/get-weld-inspection-offer?status=${status}`;
            const response = await axios({
                method: 'post',
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
            return error;
        }
    })

const getUserWeldVisualSlice = createSlice({
    name: "getUserWeldVisual",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserWeldVisual.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWeldVisual.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserWeldVisual.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserWeldVisualSlice.reducer;