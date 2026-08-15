import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getFIMidData = createAsyncThunk('/issue/getMultipleDrawItems',
    async (id) => {
        try {
            const myurl = `${V_URL}/user/fim/get-fim-packing`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('fim_id', id.id);
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

const getFIMidDataSlice = createSlice({
    name: "getFIMidData",
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
            .addCase(getFIMidData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFIMidData.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFIMidData.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export const { clearDrawItems } = getFIMidDataSlice.actions;

export default getFIMidDataSlice.reducer;