import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssueReturnAcceptance = createAsyncThunk('/issue/getIssueReturnAcceptance',
    async ({page, limit, search = ''}) => {
        try {
            const myurl = `${V_URL}/user/get-material-issue-return-acceptance`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            if (page !== undefined) bodyFormData.append('page', page);
            if (limit !== undefined) bodyFormData.append('limit', limit);
            if (search) bodyFormData.append('search', search);
            const response = await axios({
                method: 'post',
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
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getIssueReturnAcceptanceSlice = createSlice({
    name: "getIssueReturnAcceptance",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueReturnAcceptance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptance.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptance.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueReturnAcceptanceSlice.reducer;