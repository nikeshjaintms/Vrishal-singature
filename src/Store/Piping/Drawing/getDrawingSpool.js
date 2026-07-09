import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDrawingSpool = createAsyncThunk('/issue/getDrawingSpool',
    async ({ contractor_id, project_id  }) => {
        try {
            const myurl = `${V_URL}/user/get-drawing-basic-items`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append("contractor_id", contractor_id);
         bodyFormData.append("project_id", project_id);

            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
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
    });

const getDrawingSpoolSlice = createSlice({
    name: "getDrawingSpool",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    // reducers: {},
      reducers: {
    clearDrawingSpoolItems(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
    extraReducers: (builder) => {
        builder
            .addCase(getDrawingSpool.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDrawingSpool.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getDrawingSpool.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})
export const { clearDrawingSpoolItems } = getDrawingSpoolSlice.actions;
export default getDrawingSpoolSlice.reducer;