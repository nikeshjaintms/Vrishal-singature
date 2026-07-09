import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addTransport = createAsyncThunk(
    '/add/addTransport',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-transport`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addTransport = response.data;

            if (addTransport.success === true) {
                toast.success(addTransport?.message);
                return addTransport;
            } else {
                throw new Error(addTransport);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addTransportSlice = createSlice({
    name: "addTransport",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTransport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTransport.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addTransport.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addTransportSlice.reducer;