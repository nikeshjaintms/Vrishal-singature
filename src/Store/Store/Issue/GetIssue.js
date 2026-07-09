import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getIssue = createAsyncThunk('/user/get-ms-alltransaction',
    async ({ tag_number }) => {
        try {
            console.log(tag_number);

            const myurl = `${V_URL}/user/get-ms-alltransaction`;

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('tag_number', tag_number)

            const response = await axios({
                method: 'get',
                url: myurl,
                params: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getOrder response");
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

const getIssueSlice = createSlice({
    name: "getIssue",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getIssue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getIssue.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getIssue.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getIssueSlice.reducer;