import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch FinalCoatShade list
export const getUserFtAdded = createAsyncThunk(
    "/issue/getUserFtAdded",
    async ({ page = 1, limit = 10, search = "", status = "" } = {}, { rejectWithValue }) => {
        try {
            const project_id = localStorage.getItem("U_PROJECT_ID");
            const token = localStorage.getItem("PAY_USER_TOKEN");

            console.log("Fetching Paint Requirement list with:", { project_id, search, page, limit, status });

            const response = await axios.post(
                `${V_URL}/user/piping-list-multi-ft-inspection`,
                { project_id, search, page, limit, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                return response.data; // { data, total, page, pages }
            } else {
                throw new Error(response.data.message || "Failed to fetch FinalCoatShade");
            }
        } catch (error) {
            console.error("Error fetching FinalCoatShade list:", error);
            toast.error(error.response?.data?.message || error.message);
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const getUserFtAddedSlice = createSlice({
    name: "getUserFtAdded",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserFtAdded.pending, (state) => {
                console.log("Fetching FinalCoatShades: pending");
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserFtAdded.fulfilled, (state, action) => {
                console.log("Fetching FinalCoatShades: fulfilled", action.payload);
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })

            .addCase(getUserFtAdded.rejected, (state, action) => {
                console.error("Fetching FinalCoatShades: rejected", action.payload, action.error);
                const errorMessage = action.payload?.message || action.error?.message || "Unknown error";

                state.user = null;
                state.loading = false;
                state.error = errorMessage;
            });
    },
});

export default getUserFtAddedSlice.reducer;