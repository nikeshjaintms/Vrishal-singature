import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getUserOffer = createAsyncThunk('/issue/getUserOffer',
    async ({page,limit,search}) => {
        try {
            const myurl = `${V_URL}/user/get-purchase-offer`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            if(page) bodyFormData.append("page",page);
            if(limit) bodyFormData.append("limit",limit);
             if(search) bodyFormData.append("search",search);
             
            const response = await axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            // console.log(data, "getUserOffer response");
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

const getUserOfferSlice = createSlice({
    name: "getUserOffer",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserOffer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserOffer.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserOffer.rejected, (state, action) => {
                state.user = null;
                state.loading = false;
                state.error = action.error.message;
            });
    }
})

export default getUserOfferSlice.reducer;