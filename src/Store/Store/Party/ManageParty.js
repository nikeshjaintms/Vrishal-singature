import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const addParty = createAsyncThunk(
    '/add/addParty',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-party`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addParty = response.data;
            // console.log(addParty, '@@@')

            if (addParty.success === true) {
                toast.success(addParty?.message);
                return addParty;
            } else {
                toast.error(addParty?.message);
                throw new Error(addParty);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addPartySlice = createSlice({
    name: "addParty",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addParty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addParty.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addParty.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addPartySlice.reducer;