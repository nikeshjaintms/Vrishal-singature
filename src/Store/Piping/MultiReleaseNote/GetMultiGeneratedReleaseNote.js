import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
import { getMultiPacking } from "../MultiPacking/GetMultiPacking";

// export const GetMultiGenReleaseNote = createAsyncThunk(
//   "/user/list-multi-release-generate",
//   async () => {
//     try {
//       const myurl = `${V_URL}/user/list-multi-release-generate`;
//       const Project = localStorage.getItem("U_PROJECT_ID");
//       const bodyFormData = new URLSearchParams();
//       bodyFormData.append("project_id", Project);
//       const response = await axios({
//         method: "Post",
//         url: myurl,
//         data: bodyFormData,
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       const data = response?.data;

//       if (data.success === true) {
//         return data;
//       } else {
//         throw new Error(data);
//       }
//     } catch (error) {
//       console.log(error, "error");
//       toast.error(error.response.data.message);
//       return error;
//     }
//   }
// );

export const GetMultiGenReleaseNotePiping = createAsyncThunk(
  "/user/list-multi-release-generate",
  async ({ page , limit, search } = {}) => {
    try {
      const baseUrl = `${V_URL}/user/piping/list-multi-release-generate`;
      const Project = localStorage.getItem("U_PROJECT_ID");

      // Build dynamic query params
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      // if (limit !== null && limit !== undefined && limit !== "") queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);

      const finalUrl = `${baseUrl}?${queryParams.toString()}`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", Project);

      const response = await axios({
        method: "POST",
        url: finalUrl,
        data: bodyFormData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response?.data;

      if (data.success === true) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch release notes.");
      }
    } catch (error) {
      console.log("GetMultiGenReleaseNote error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);


const GetMultiGenReleaseNotePipingSlice = createSlice({
  name: "GetMultiGenReleaseNotePiping",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMultiGenReleaseNotePiping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMultiGenReleaseNotePiping.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetMultiGenReleaseNotePiping.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetMultiGenReleaseNotePipingSlice.reducer;
