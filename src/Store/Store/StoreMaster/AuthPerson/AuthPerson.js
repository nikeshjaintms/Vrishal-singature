import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getStoreAuthPerson = createAsyncThunk('/auth/getStoreAuthPerson',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-auth-person`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const groupData = response.data;
            // console.log(groupData, "getStoreAuthPerson response");

            if (groupData.success === true) {
                return groupData;
            } else {
                throw new Error(groupData);
            }
        } catch (error) {
            
            toast.error(error.response.data.message);
            return error
        }
    })

const getStoreAuthPersonSlice = createSlice({
    name: "getStoreAuthPerson",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStoreAuthPerson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStoreAuthPerson.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getStoreAuthPerson.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getStoreAuthPersonSlice.reducer;