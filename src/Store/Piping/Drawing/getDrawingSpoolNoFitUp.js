import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

/* ============================
   API CALL
============================ */
export const getDrawingSpoolNoFitUp = createAsyncThunk(
    "spool/getDrawingSpoolNoFitUp",
    async (_, { rejectWithValue }) => {
        try {
            const url = `${V_URL}/user/get-drawing-spool-items`;

            const response = await axios.get(url, {
                params: {
                    project_id: localStorage.getItem('U_PROJECT_ID'),
                },
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                },
            });

            if (response.data.success) {
                return response.data.data; // return only array
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
            return rejectWithValue(error.message);
        }
    }
);

/* ============================
   SLICE
============================ */
const getDrawingSpoolNoFitUpSlice = createSlice({
    name: "getDrawingSpoolNoFitUp",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDrawingSpoolNoFitUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDrawingSpoolNoFitUp.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getDrawingSpoolNoFitUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getDrawingSpoolNoFitUpSlice.reducer;
