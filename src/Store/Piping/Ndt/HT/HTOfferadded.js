import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// Async thunk to fetch HT Inspection list
export const getUserHtAdded = createAsyncThunk(
    "/issue/getUserHtAdded",
    async ({ page, limit, search, status } = {}, { rejectWithValue }) => {
        try {
            const project_id = localStorage.getItem("U_PROJECT_ID");
            const token = localStorage.getItem("PAY_USER_TOKEN");

            console.log("Fetching HT list with:", {
                project_id,
                search,
                page,
                limit,
                status,
            });

            const response = await axios.post(
                `${V_URL}/user/piping-list-multi-ht-inspection`,
                { project_id, search, page, limit, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                return response.data;
                // Expected:
                // {
                //   data: [],
                //   pagination: { page, pages, total }
                // }
            } else {
                throw new Error(
                    response.data.message || "Failed to fetch HT list"
                );
            }
        } catch (error) {
            console.error("Error fetching HT list:", error);

            const message =
                error.response?.data?.message || error.message;

            toast.error(message);

            return rejectWithValue(
                error.response?.data || { message }
            );
        }
    }
);

const getUserHtAddedSlice = createSlice({
    name: "getUserHtAdded",
    initialState: {
        dataByStatus: {}, // store data separately per status
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // PENDING
            .addCase(getUserHtAdded.pending, (state) => {
                console.log("Fetching HT list: pending");
                state.loading = true;
                state.error = null;
            })

            // FULFILLED
            .addCase(getUserHtAdded.fulfilled, (state, action) => {
                console.log("Fetching HT list: fulfilled", action.payload);

                const rawStatus = action.meta.arg?.status;

                // ✅ Proper normalization
                const statusKey =
                    rawStatus === null || rawStatus === undefined
                        ? "ALL"
                        : rawStatus.toString();

                state.dataByStatus[statusKey] = {
                    data: action.payload.data,
                    pagination: action.payload.pagination,
                };

                state.loading = false;
                state.error = null;
            })

            // REJECTED
            .addCase(getUserHtAdded.rejected, (state, action) => {
                console.error(
                    "Fetching HT list: rejected",
                    action.payload,
                    action.error
                );

                state.loading = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Unknown error";
            });
    },
});

export default getUserHtAddedSlice.reducer;
