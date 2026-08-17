import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";

// Thunk to get Party LHS for Client
export const getPartyLHSClient = createAsyncThunk(
    "getPartyLHSClient",
    async (args, { rejectWithValue }) => {
        try {
            const { project, page, limit, search } = args;
            
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (search) params.append("search", search);
            if (project) params.append("project", project);

            const token = localStorage.getItem("PARTY_TOKEN");
            const response = await axios.post(
                `${V_URL}/party/get-lhs-client?${params.toString()}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk to download LHS for Client
export const downloadLHSForClient = createAsyncThunk(
    "downloadLHSForClient",
    async (args, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("PARTY_TOKEN");
            const response = await axios.post(
                `${V_URL}/party/download-lhs-client`,
                args,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk to update LHS Client Status
export const updateLHSClientStatus = createAsyncThunk(
    "updateLHSClientStatus",
    async (args, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("PARTY_TOKEN");
            const response = await axios.post(
                `${V_URL}/party/update-lhs-client-status`,
                args,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getClientPipingMultiLHSSlice = createSlice({
    name: "getClientPipingMultiLHS",
    initialState: {
        data: [],
        loading: false,
        error: null,
        downloadLoading: false,
        downloadError: null,
        updateStatusLoading: false,
        updateStatusError: null,
        updateStatusSuccess: false
    },
    reducers: {
        resetUpdateStatusState: (state) => {
            state.updateStatusLoading = false;
            state.updateStatusError = null;
            state.updateStatusSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // getPartyLHSClient
            .addCase(getPartyLHSClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPartyLHSClient.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPartyLHSClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // downloadLHSForClient
            .addCase(downloadLHSForClient.pending, (state) => {
                state.downloadLoading = true;
                state.downloadError = null;
            })
            .addCase(downloadLHSForClient.fulfilled, (state) => {
                state.downloadLoading = false;
            })
            .addCase(downloadLHSForClient.rejected, (state, action) => {
                state.downloadLoading = false;
                state.downloadError = action.payload;
            })
            // updateLHSClientStatus
            .addCase(updateLHSClientStatus.pending, (state) => {
                state.updateStatusLoading = true;
                state.updateStatusError = null;
                state.updateStatusSuccess = false;
            })
            .addCase(updateLHSClientStatus.fulfilled, (state) => {
                state.updateStatusLoading = false;
                state.updateStatusSuccess = true;
            })
            .addCase(updateLHSClientStatus.rejected, (state, action) => {
                state.updateStatusLoading = false;
                state.updateStatusError = action.payload;
            });
    },
});

export const { resetUpdateStatusState } = getClientPipingMultiLHSSlice.actions;
export default getClientPipingMultiLHSSlice.reducer;
