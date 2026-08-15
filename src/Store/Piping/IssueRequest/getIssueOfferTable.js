import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssueOfferTablePiping = createAsyncThunk('/party/getIssueOfferTablePiping',
    async ({ contractor_id, project_id }) => {
        try {
            const myurl = `${V_URL}/user/get-issue-offer-table-piping?contractor_id=${contractor_id}&project_id=${project_id}`;
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
            toast.error(error.response.data.message || "Something went wrong");
            return error
        }
    });

const getIssueOfferTablePipingSlice = createSlice({
    name: "getIssueOfferTablePiping",
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
            .addCase(getIssueOfferTablePiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssueOfferTablePiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssueOfferTablePiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})
export const { clearIssueOfferItems } = getIssueOfferTablePipingSlice.actions;
export default getIssueOfferTablePipingSlice.reducer;