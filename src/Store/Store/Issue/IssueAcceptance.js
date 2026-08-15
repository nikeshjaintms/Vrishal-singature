import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserIssueAcceptance = createAsyncThunk('/issue/getUserIssueAcceptance',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-issue-acceptance`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
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

const getUserIssueAcceptanceSlice = createSlice({
    name: "getUserIssueAcceptance",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserIssueAcceptance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserIssueAcceptance.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserIssueAcceptance.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserIssueAcceptanceSlice.reducer;