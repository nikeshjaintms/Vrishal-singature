import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getPipingPMS = createAsyncThunk(
    '/user/get-piping-dashboard',
    async () => {
        try {
            const formdata = new URLSearchParams()
            formdata.append('project', localStorage.getItem("U_PROJECT_ID"))
            const myurl = `${V_URL}/user/get-piping-dashboard`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: formdata,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const PMS = response.data;

            if (PMS.success === true) {
                // toast.success(PMS?.message);
                return PMS;
            } else {
                throw new Error(PMS);
            }
        } catch (error) {
            // console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);
const getPipingPMSSlice = createSlice({
    name: "getPipingPMS",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPipingPMS.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPipingPMS.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPipingPMS.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getPipingPMSSlice.reducer;