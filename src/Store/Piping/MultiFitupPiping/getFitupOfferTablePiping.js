import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getFitupOfferTablePiping = createAsyncThunk('/party/getFitupOfferTablePiping',
    async ({ issue_id, project_id }) => {
        try {
        const myurl = `${V_URL}/user/get-fitup-offer-table-piping?issue_id=${issue_id}&project_id=${project_id}`;
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
            toast.error(error.response.data.message);
            return error
        }
    });

const getFitupOfferTablePipingSlice = createSlice({
    name: "getFitupOfferTablePiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFitupOfferTablePiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFitupOfferTablePiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFitupOfferTablePiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getFitupOfferTablePipingSlice.reducer;