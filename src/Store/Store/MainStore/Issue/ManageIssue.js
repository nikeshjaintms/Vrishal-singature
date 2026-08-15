import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addIssue = createAsyncThunk(
    '/add/addItem',
    async (payload) => {
        try {
            const myurl = `${V_URL}/user/add-one-iss`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: payload,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addItem = response.data;
            // console.log(addItem, '@@@')

            if (addItem.success === true) {
                toast.success(addItem?.message);
                return addItem;
            } else {
                // console.log(addItem.message, "&&&&")
                throw new Error(addItem);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addIssueSlice = createSlice({
    name: "addIssue",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIssue.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addIssue.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addIssueSlice.reducer;