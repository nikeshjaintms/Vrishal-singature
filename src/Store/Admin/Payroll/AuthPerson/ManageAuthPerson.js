import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addAuthPerson = createAsyncThunk(
    '/add/addAuthPerson',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-authorized-person`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addAuthPerson = response.data;
            // console.log(addAuthPerson, '@@@')

            if (addAuthPerson.success === true) {
                toast.success(addAuthPerson?.message);
                return addAuthPerson;
            } else {
                // console.log(addAuthPerson.message, "&&&&")
                throw new Error(addAuthPerson);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addAuthPersonSlice = createSlice({
    name: "addAuthPerson",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addAuthPerson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAuthPerson.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addAuthPerson.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addAuthPersonSlice.reducer;