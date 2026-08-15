import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getIssueGetPass = createAsyncThunk('/user/iss-gate-pass',
    async () => {
        try {
            const myurl = `${V_URL}/user/iss-gate-pass`;

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('tag_number', 13)
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))


            const response = await axios({
                method: 'POST',
                url: myurl,
                data: bodyFormData,
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

const getIssueGetPassSlice = createSlice({
    name: "getIssueGetPass",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueGetPass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueGetPass.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueGetPass.rejected, (state, action) => {
                state.data = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueGetPassSlice.reducer;