import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../../BaseUrl";

export const getClientPipingMultiReleaseNote = createAsyncThunk(
    "getClientPipingMultiReleaseNote",
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
                `${V_URL}/party/get-release-note-client?${params.toString()}`,
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

export const getClientPipingMultiReleaseNoteSlice = createSlice({
    name: "getClientPipingMultiReleaseNote",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClientPipingMultiReleaseNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getClientPipingMultiReleaseNote.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getClientPipingMultiReleaseNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getClientPipingMultiReleaseNoteSlice.reducer;
