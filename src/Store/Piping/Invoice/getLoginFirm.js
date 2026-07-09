import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getLoginFirm = createAsyncThunk('/user/getLoginFirm',
    async () => {
        try {
            const fId = localStorage.getItem('PAY_USER_FIRM_ID');
            const myurl = `${V_URL}/user/get-user-firm/${fId}`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });
            const data = response.data;

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getLoginFirmSlice = createSlice({
    name: "getLoginFirm",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLoginFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLoginFirm.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getLoginFirm.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getLoginFirmSlice.reducer;