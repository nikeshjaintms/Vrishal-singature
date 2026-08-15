import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getAdminGroup = createAsyncThunk('/group/getAdminGroup',
    async (group) => {
        try {
            const myurl = `${V_URL}/admin/get-admin-group`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const groupData = response.data;
            // console.log(groupData, "getAdminGroup response");

            if (groupData.success === true) {
                return groupData;
            } else {
                throw new Error(groupData);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    })

const getAdminGroupSlice = createSlice({
    name: "getAdminGroup",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminGroup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminGroup.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminGroupSlice.reducer;