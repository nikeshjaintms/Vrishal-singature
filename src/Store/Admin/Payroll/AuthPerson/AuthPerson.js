import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAuthPerson = createAsyncThunk('/auth/getAuthPerson',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-authorized-person`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const groupData = response.data;
            // console.log(groupData, "getAuthPerson response");

            if (groupData.success === true) {
                return groupData;
            } else {
                throw new Error(groupData);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getAuthPersonSlice = createSlice({
    name: "getAuthPerson",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAuthPerson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAuthPerson.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAuthPerson.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAuthPersonSlice.reducer;