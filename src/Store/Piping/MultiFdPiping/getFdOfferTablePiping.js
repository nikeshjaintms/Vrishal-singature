import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getFdOfferTablePiping = createAsyncThunk('/party/getFdOfferTablePiping',
    async ({ project_id }) => {
        try {
        const myurl = `${V_URL}/user/get-fd-offer-table-piping?project_id=${project_id}`;
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
            toast.error(error.response.data.message);
            return error
        }
    });

const getFdOfferTablePipingSlice = createSlice({
    name: "getFdOfferTablePiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFdOfferTablePiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFdOfferTablePiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFdOfferTablePiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getFdOfferTablePipingSlice.reducer;