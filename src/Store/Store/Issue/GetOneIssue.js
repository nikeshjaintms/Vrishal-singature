import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getOneIssue = createAsyncThunk('/user/get-ms-onetransaction',
    async ({ tag_number, id }) => {
        try {
            const myurl = `${V_URL}/user/get-ms-onetransaction`;

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('tag_number', tag_number)
            bodyFormData.append('id', id)

            const response = await axios({
                method: 'get',
                url: myurl,
                params: bodyFormData,
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
    })

const getOneIssueSlice = createSlice({
    name: "getOneIssue",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOneIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOneIssue.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getOneIssue.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getOneIssueSlice.reducer;