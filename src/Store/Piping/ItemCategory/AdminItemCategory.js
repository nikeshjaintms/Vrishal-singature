import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getAdminItemCategory = createAsyncThunk('/category/getAdminItemCategory',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-piping-admin-item-Category`;

            const response = await axios({
                method: 'get',
                url: myurl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getAdminCategory response");

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

const getAdminItemCategorySlice = createSlice({
    name: "getAdminItemCategory",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminItemCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminItemCategory.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAdminItemCategory.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getAdminItemCategorySlice.reducer;