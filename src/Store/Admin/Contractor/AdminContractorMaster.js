import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const AdminContractorMaster = createAsyncThunk('/admin/get-contractor',
    async ({ status }) => {
        try {
            const myurl = `${V_URL}/admin/get-contractor?status=${status}`;
            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserContractor response");
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

const AdminContractorMasterSlice = createSlice({
    name: "getAdminContractor",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AdminContractorMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AdminContractorMaster.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(AdminContractorMaster.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default AdminContractorMasterSlice.reducer;