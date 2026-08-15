import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addStoreAuthPerson = createAsyncThunk(
    '/add/addStoreAuthPerson',
    async (add) => {

        try {
            const myurl = `${V_URL}/user/manage-auth-person`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const addStoreAuthPerson = response.data;
            // console.log(addStoreAuthPerson, '@@@')

            if (addStoreAuthPerson.success === true) {
                toast.success(addStoreAuthPerson?.message);
                return addStoreAuthPerson;
            } else {
                // console.log(addStoreAuthPerson.message, "&&&&")
                throw new Error(addStoreAuthPerson);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addStoreAuthPersonSlice = createSlice({
    name: "addStoreAuthPerson",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addStoreAuthPerson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStoreAuthPerson.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addStoreAuthPerson.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addStoreAuthPersonSlice.reducer;