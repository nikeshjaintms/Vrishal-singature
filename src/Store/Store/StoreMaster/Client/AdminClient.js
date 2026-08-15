import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminClient = createAsyncThunk('/client/getAdminClient',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-admin-client`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const bankData = response.data;
            // console.log(bankData, "getAdminClient response");

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

const getAdminClientSlice = createSlice({
    name: "getAdminClient",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminClient.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminClient.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminClientSlice.reducer;