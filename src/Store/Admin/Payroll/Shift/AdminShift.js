import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminShift = createAsyncThunk('/shift/getAdminShift',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-admin-shift`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const groupData = response.data;
            // console.log(groupData, "getAdminShift response");

            if (groupData.success === true) {
                return groupData;
            } else {
                throw new Error(groupData);
            }
        } catch (error) {
            // console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getAdminShiftSlice = createSlice({
    name: "getAdminShift",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminShift.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminShift.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminShift.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminShiftSlice.reducer;