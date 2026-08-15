import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addClient = createAsyncThunk(
    '/add/addClient',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-client`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addClient = response.data;
            // console.log(addClient, '@@@')

            if (addClient.success === true) {
                toast.success(addClient?.message);
                return addClient;
            } else {
                // console.log(addClient.message, "&&&&")
                throw new Error(addClient);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addClientSlice = createSlice({
    name: "addClient",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addClient.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addClientSlice.reducer;