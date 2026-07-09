import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserDrawTrasaction = createAsyncThunk('/party/getUserDrawTrasaction',
    async ({ id }) => {
        if (id) {
            try {
                const myurl = `${V_URL}/user/get-drawing-transaction`;
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('id', id)
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
                    throw new Error(data);
                }
            } catch (error) {
                toast.error(error.response.data.message);
                return error
            }
        }
    })

const getUserDrawTrasactionSlice = createSlice({
    name: "getUserDrawTrasaction",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserDrawTrasaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDrawTrasaction.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserDrawTrasaction.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserDrawTrasactionSlice.reducer;