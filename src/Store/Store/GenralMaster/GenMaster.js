import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getGenMaster = createAsyncThunk('/user/get-master',
    async ({ tag_id }) => {
        try {

            const myurl = `${V_URL}/user/get-master`;
            const response = await axios({
                method: 'get',
                url: myurl,
                params: { tag_id: tag_id },
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
    })

const getGenMasterSlice = createSlice({
    name: "getGenMaster",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getGenMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGenMaster.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getGenMaster.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getGenMasterSlice.reducer;