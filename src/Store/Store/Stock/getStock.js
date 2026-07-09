// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { V_URL } from "../../../BaseUrl";

// export const getItemStock = createAsyncThunk('/party/getItemStock',
//     async ({ storeType }) => {
//         try {
//             const myurl = `${V_URL}/user/get-itemStock`;
//             const FormData = new URLSearchParams();
//             FormData.append('store_type', storeType);

//             const response = await axios({
//                 method: 'post',
//                 url: myurl,
//                 data: FormData,
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
//                 },
//             });

//             const data = response.data;
//             // console.log(data, "getItemStock response");

//             if (data.success === true) {
//                 return data;
//             } else {
//                 throw new Error(data);
//             }
//         } catch (error) {
//             
//             toast.error(error.response.data.message);
//             return error
//         }
//     })

// const getItemStockSlice = createSlice({
//     name: "getItemStock",
//     initialState: {
//         user: null,
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(getItemStock.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(getItemStock.fulfilled, (state, action) => {
//                 state.user = action.payload;
//                 state.loading = false;
//                 state.error = null;
//             })
//             .addCase(getItemStock.rejected, (state, action) => {
//                 state.user = null;
//                 state.loading = false;
//                 state.error = action.error.message;
//             });
//     }
// })

// export default getItemStockSlice.reducer;