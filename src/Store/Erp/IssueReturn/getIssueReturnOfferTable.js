import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssueReturnOfferTable = createAsyncThunk('/party/getIssueReturnOfferTable',
    async ({ project_id }) => {
        try {
            const myurl = `${V_URL}/user/get-material-issue-offer-return?project_id=${project_id}`;
            const response = await axios({
                method: 'post',
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
            toast.error(error.response.data.message || "Something went wrong");
            return error
        }
    });

const getIssueReturnOfferTableSlice = createSlice({
    name: "getIssueReturnOfferTable",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    // reducers: {},
      reducers: {
    clearIssueOfferItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
    extraReducers: (builder) => {
        builder
            .addCase(getIssueReturnOfferTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueReturnOfferTable.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueReturnOfferTable.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})
export const { clearIssueOfferItems } = getIssueReturnOfferTableSlice.actions;
export default getIssueReturnOfferTableSlice.reducer;