import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getSuperDpr = createAsyncThunk("/super_admin/getSuperDpr", async ({ pId }) => {
    try {
        const myurl = `${V_URL}/super_admin/get-grid-dpr?project=${pId}`;
        const response = await axios({
            method: "get",
            url: myurl,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("VE_SUPER_TOKEN"),
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
        return error;
    }
});

const getSuperDprSlice = createSlice({
    name: "getSuperDpr",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSuperDpr.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSuperDpr.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getSuperDpr.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default getSuperDprSlice.reducer;
