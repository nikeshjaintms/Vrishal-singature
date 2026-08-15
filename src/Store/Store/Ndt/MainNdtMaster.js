import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserMainNdtMaster = createAsyncThunk('/issue/getUserMainNdtMaster',
    async ({ status }) => {
        try {
            const myurl = `${V_URL}/user/get-ndt-master?status=${status}`;
            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserMainNdtMaster response");
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

const getUserMainNdtMasterSlice = createSlice({
    name: "getUserMainNdtMaster",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserMainNdtMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserMainNdtMaster.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserMainNdtMaster.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserMainNdtMasterSlice.reducer;