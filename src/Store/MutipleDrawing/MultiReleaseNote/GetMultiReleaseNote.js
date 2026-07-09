import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

// export const GetMultiReleaseNote = createAsyncThunk(
//   "/party/GetMultiReleaseNote",
//   async () => {
//     try {
//       const myurl = `${V_URL}/user/get-multi-release-note`;
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


export const GetMultiReleaseNote = createAsyncThunk(
  "/party/GetMultiReleaseNote",
  async ({ page , limit, search } = {}) => {
    try {
      console.log("Searhc",search);
      const baseUrl = `${V_URL}/user/get-multi-release-note`;
      const Project = localStorage.getItem("U_PROJECT_ID");

      // Build query string dynamically
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit !== null && limit !== undefined && limit !== "") queryParams.append("limit", limit);
      if(search) queryParams.append("search", search);
     

      const myurl = `${baseUrl}?${queryParams.toString()}`;

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project_id", Project);
  
      const response = await axios({
        method: "POST",
        url: myurl,
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
      console.log("GetMultiReleaseNote error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);


const GetMultiReleaseNoteSlice = createSlice({
  name: "GetMultiReleaseNote",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMultiReleaseNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMultiReleaseNote.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetMultiReleaseNote.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default GetMultiReleaseNoteSlice.reducer;
