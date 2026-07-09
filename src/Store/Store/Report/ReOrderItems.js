import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getReorderItems = createAsyncThunk('/party/getReorderItems',
    async (bodyFromData) => {
        console.log(bodyFromData, 'bodyFromData')
        try {
            const myurl = `${V_URL}/user/reorder-item-list`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFromData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getReorderItems response");

            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            
            toast.error(error.response.data.message);
            return error
        }
    })

const getReorderItemsSlice = createSlice({
    name: "getReorderItems",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReorderItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReorderItems.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getReorderItems.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getReorderItemsSlice.reducer;