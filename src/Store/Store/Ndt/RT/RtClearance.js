import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getUserRtClearance = createAsyncThunk('/issue/getUserRtClearance',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-rt-report`;
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

const getUserRtClearanceSlice = createSlice({
    name: "getUserRtClearance",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserRtClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserRtClearance.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserRtClearance.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserRtClearanceSlice.reducer;