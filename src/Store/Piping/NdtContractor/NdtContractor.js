import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ============================
   THUNK
============================ */
export const getNdtContractor = createAsyncThunk(
    "ndtContractor/getNdtContractor",
    async ({ page = 1, limit = 10, search = "", project }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${V_URL}/user/get-ndt-contractor`,
                {
                    params: { page, limit, search, project },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }
            );

            return response.data; // { success, data }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            return rejectWithValue(error?.response?.data);
        }
    }
);

/* ============================
   SLICE
============================ */
const getNdtContractorSlice = createSlice({
    name: "getNdtContractor",
    initialState: {
        data: [],        // ✅ TABLE DATA
        total: 0,        // ✅ PAGINATION
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNdtContractor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNdtContractor.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data || []; // ✅ ARRAY
                state.total = action.payload?.total || action.payload?.data?.length || 0;
                state.error = null;
            })
            .addCase(getNdtContractor.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.total = 0;
                state.error = action.payload || action.error.message;
            });
    },
});

export default getNdtContractorSlice.reducer;
