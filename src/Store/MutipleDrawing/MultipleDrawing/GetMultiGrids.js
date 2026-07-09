import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultiGrids = createAsyncThunk(
    "/user/getMultiGrids",
    async (drawingIds) => {
        try {
            const myurl = `${V_URL}/user/get-multi-grid-drawing`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append("drawIds", JSON.stringify(drawingIds));
            const response = await axios({
                method: "POST",
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
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
    }
);

const getMultiGridsSlice = createSlice({
    name: "getMultiGrids",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiGrids.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiGrids.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiGrids.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default getMultiGridsSlice.reducer;