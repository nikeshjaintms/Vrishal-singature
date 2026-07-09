import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssueReturnAcceptanceSummary = createAsyncThunk('/issue/getIssueReturnAcceptanceSummary',
    async ({id, project, page,limit,search}) => {
        try {
            const myurl = `${V_URL}/user/get-issue-return-summary?project=${project}&page=${page}&limit=${limit}`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            
             bodyFormData.append('page', page);
            bodyFormData.append('limit', limit);
            bodyFormData.append('search', search);
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
                return data.data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const getIssueReturnAcceptanceSummarySlice = createSlice({
    name: "getIssueReturnAcceptanceSummary",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssueReturnAcceptanceSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptanceSummary.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueReturnAcceptanceSummary.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueReturnAcceptanceSummarySlice.reducer;