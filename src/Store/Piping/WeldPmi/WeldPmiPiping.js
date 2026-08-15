import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserWeldPmiPiping = createAsyncThunk('/issue/getUserWeldPmiPiping',
    async ({ page, limit, search, status } = {}) => {
        try {
            const myurl = `${V_URL}/user/get-piping-pmi-drawings`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: {
                    project_id: localStorage.getItem('U_PROJECT_ID'),
                    page,
                    limit,
                    search,
                    status
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            console.log(data, "getUserWeldPmiPiping response");
            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error;
        }
    })

const getUserWeldPmiPipingSlice = createSlice({
    name: "getUserWeldPmiPiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserWeldPmiPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWeldPmiPiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserWeldPmiPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserWeldPmiPipingSlice.reducer;