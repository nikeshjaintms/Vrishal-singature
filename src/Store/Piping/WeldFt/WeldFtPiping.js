import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserWeldFtPiping = createAsyncThunk('/issue/getUserWeldFtPiping',
    async ({ page, limit, search }) => {
        try {
            const myurl = `${V_URL}/user/get-piping-ferrite-drawings`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: {
                    project_id: localStorage.getItem('U_PROJECT_ID'),
                    page,
                    limit,
                    search,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserJointType response");
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

const getUserWeldFtPipingSlice = createSlice({
    name: "getUserWeldFtPiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserWeldFtPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWeldFtPiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserWeldFtPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserWeldFtPipingSlice.reducer;