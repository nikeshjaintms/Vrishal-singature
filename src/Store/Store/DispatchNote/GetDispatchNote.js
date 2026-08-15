import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDispatchNotes = createAsyncThunk('/party/get-dispatch-note',
    async () => {
        try {
            const myurl = `${V_URL}/user/get-dispatch-note`;

            const bodyFormData = new URLSearchParams();

            const response = await axios({
                method: 'get',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getDispatchNotes response");

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

const getDispatchNotesSlice = createSlice({
    name: "getDispatchNotes",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDispatchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDispatchNotes.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getDispatchNotes.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getDispatchNotesSlice.reducer;