import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getShift = createAsyncThunk('/shift/getShift',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-shift`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const shiftDate = response.data;
            // console.log(shiftDate, "getShift response");

            if (shiftDate.success === true) {
                return shiftDate;
            } else {
                throw new Error(shiftDate);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getShiftSlice = createSlice({
    name: "getShift",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getShift.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getShift.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getShiftSlice.reducer;