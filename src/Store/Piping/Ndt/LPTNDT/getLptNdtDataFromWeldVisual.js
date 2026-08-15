import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

export const getLptNdtDataFromWeldVisualPiping = createAsyncThunk('/issue/getLptNdtDataFromWeldVisualPiping',
    async ({page, limit, search = ""}) => {
        try {
            const myurl = `${V_URL}/user/piping-get-lpt-ndt-offer-data-from-weld-visual`;
             const project_id = localStorage.getItem("U_PROJECT_ID");

            const response = await axios({
                method: 'post',
                url: myurl,
                data:{project_id, page, limit, search},
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserJointType response");
            if (data.success === true) {
                return data;
            } else {
                throw new Error(data);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error;
        }
    })

const getLptNdtDataFromWeldVisualPipingSlice = createSlice({
    name: "getLptNdtDataFromWeldVisualPiping",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLptNdtDataFromWeldVisualPiping.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLptNdtDataFromWeldVisualPiping.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getLptNdtDataFromWeldVisualPiping.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getLptNdtDataFromWeldVisualPipingSlice.reducer;