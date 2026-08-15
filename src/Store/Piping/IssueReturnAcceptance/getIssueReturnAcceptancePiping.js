import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssueReturnAcceptancePiping = createAsyncThunk('/issue/getIssueReturnAcceptancePiping',
    async ({page, limit, search = ''}) => {
        try {
            const myurl = `${V_URL}/user/get-material-issue-return-acceptance-piping`;
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

const getIssueReturnAcceptancePipingSlice = createSlice({
    name: "getIssueReturnAcceptancePiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueReturnAcceptancePiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptancePiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptancePiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueReturnAcceptancePipingSlice.reducer;