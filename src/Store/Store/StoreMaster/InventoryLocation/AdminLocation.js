import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminLocation = createAsyncThunk('/location/getAdminLocation',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-admin-inventoryLocation`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const bankData = response.data;

            if (bankData.success === true) {
                return bankData;
            } else {
                throw new Error(bankData);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error
        }
    })

const getAdminLocationSlice = createSlice({
    name: "getAdminLocation",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminLocation.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminLocation.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminLocationSlice.reducer;