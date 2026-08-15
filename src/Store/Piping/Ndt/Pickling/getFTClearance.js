import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getFtClearance = createAsyncThunk('/party/getFtClearance',
    async () => {
        const projectId = localStorage.getItem('U_PROJECT_ID')
        try {
            const myurl = `${V_URL}/user/get-multi-ft-clearance?project_id=${projectId}`;
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
    });

const getFtClearanceSlice = createSlice({
    name: "getFtClearance",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFtClearance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFtClearance.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFtClearance.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getFtClearanceSlice.reducer;