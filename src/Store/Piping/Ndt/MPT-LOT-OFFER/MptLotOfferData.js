import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch MPT Test Offer
export const fetchMPTLotOfferData = createAsyncThunk(
    "/user/piping/get-mpt-lot-offer",
    async ({ project_id }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${V_URL}/user/piping/get-mpt-lot-offer-data`,
                { project: project_id },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }
            );

            if (response.data.success) {
                return response.data.data; // return only the array of offers
            } else {
                toast.error(response.data.message);
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return rejectWithValue(error.message);
        }
    }
);

const MPTLotOfferSlice = createSlice({
    name: "MPTLotOffer",
    initialState: {
        offers: [],        // store array of offer objects
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMPTLotOfferData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMPTLotOfferData.fulfilled, (state, action) => {
                state.offers = action.payload;
                state.loading = false;
            })
            .addCase(fetchMPTLotOfferData.rejected, (state, action) => {
                state.offers = [];
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default MPTLotOfferSlice.reducer;
