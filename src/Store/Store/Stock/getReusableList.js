import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getReusableList = createAsyncThunk('/party/getReusableList',
    async (projectId, { rejectWithValue }) => { // receive projectId from component
        try {
            const myurl = `${V_URL}/user/list-usable-stock`;
            const formData = new URLSearchParams();
            
             if (projectId) {
                console.log('projectId')
                formData.append('project_id', projectId);
            }
            const response = await axios({
                method: 'post',
                url: myurl,
                data: formData,
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
    })

const getReusableListSlice = createSlice({
    name: "getReusableList",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReusableList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReusableList.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getReusableList.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getReusableListSlice.reducer;