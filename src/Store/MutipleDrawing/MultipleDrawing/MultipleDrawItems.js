import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getMultipleDrawItems = createAsyncThunk('/issue/getMultipleDrawItems',
    async (id) => {
        try {
            const myurl = `${V_URL}/user/get-grid-items`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('drawing_id', id.id);
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            if (data.success === true) {
                return data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const getMultipleDrawItemsSlice = createSlice({
    name: "getMultipleDrawItems",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDrawItems(state) {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMultipleDrawItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultipleDrawItems.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultipleDrawItems.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export const { clearDrawItems } = getMultipleDrawItemsSlice.actions;

export default getMultipleDrawItemsSlice.reducer;