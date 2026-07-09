import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addPartyGroup = createAsyncThunk(
    '/add/addPartyGroup',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-party-group`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addPartyGroup = response.data;

            if (addPartyGroup.success === true) {
                toast.success(addPartyGroup?.message);
                return addPartyGroup;
            } else {
                throw new Error(addPartyGroup);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addPartyGroupSlice = createSlice({
    name: "addPartyGroup",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPartyGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPartyGroup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addPartyGroup.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addPartyGroupSlice.reducer;