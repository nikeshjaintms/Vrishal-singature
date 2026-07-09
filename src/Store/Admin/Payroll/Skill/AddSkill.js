import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const addSkill = createAsyncThunk(
    '/add/addSkill',
    async (add) => {

        try {
            const myurl = `${V_URL}/admin/manage-skill`;

            const response = await axios({
                method: 'post',
                url: myurl,
                data: add,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                },
            });

            const addSkill = response.data;
            // console.log(addSkill, '@@@')

            if (addSkill.success === true) {
                toast.success(addSkill?.message);
                return addSkill;
            } else {
                // console.log(addSkill.message, "&&&&")
                throw new Error(addSkill.message);
            }
        } catch (error) {
            console.log(error, "!!!!")
            toast.error(error.response.data.message);
            return error;
        }
    }
);


const addSkillSlice = createSlice({
    name: "addSkill",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSkill.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addSkill.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default addSkillSlice.reducer;