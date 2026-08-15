import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";


export const getMultiWeldVisual = createAsyncThunk('/party/getMultiWeldVisual',
    async ({ status, page,limit,search }) => {
        try {
            const proId = localStorage.getItem('U_PROJECT_ID');
            const myurl = `${V_URL}/user/get-multi-weldvisual?project=${proId}&status=${status}&page=${page}&limit=${limit}&search=${search}`;

            const response = await axios({
                method: 'get',
                url: myurl,
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
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    });

const getMultiWeldVisualSlice = createSlice({
    name: "getMultiWeldVisual",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMultiWeldVisual.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMultiWeldVisual.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMultiWeldVisual.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getMultiWeldVisualSlice.reducer;