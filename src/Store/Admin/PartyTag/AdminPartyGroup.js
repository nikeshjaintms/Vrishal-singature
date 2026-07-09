import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const adminGetPartyGroup = createAsyncThunk('/party/adminGetPartyGroup',
    async () => {
        try {
            const myurl = `${V_URL}/admin/get-party-group`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
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

const adminGetPartyGroupSlice = createSlice({
    name: "adminGetPartyGroup",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminGetPartyGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetPartyGroup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminGetPartyGroup.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default adminGetPartyGroupSlice.reducer;