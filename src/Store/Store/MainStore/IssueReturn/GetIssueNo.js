import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getIssueNo = createAsyncThunk('/user/list-iss-no',
    async (payload) => {
        try {
            const myurl = `${V_URL}/user/list-iss-no`;

            const response = await axios({
                method: 'POST',
                url: myurl,
                data: payload,
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

            toast.error(error.response.data.message);
            return error
        }
    })

const getIssueNoSlice = createSlice({
    name: "getIssueNo",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueNo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueNo.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueNo.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueNoSlice.reducer;