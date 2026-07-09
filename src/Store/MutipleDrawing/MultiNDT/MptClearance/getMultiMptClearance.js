import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getMultiMptClearance = createAsyncThunk('/party/getMultiMptClearance',
    async () => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        try {
            const myurl = `${V_URL}/user/get-multi-mpt-clearance?project=${projectId}`;
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
            toast.error(error.response.data.message);
            return error
        }
    });

const getMultiMptClearanceSlice = createSlice({
    name: "getMultiMptClearance",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiMptClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiMptClearance.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiMptClearance.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiMptClearanceSlice.reducer;