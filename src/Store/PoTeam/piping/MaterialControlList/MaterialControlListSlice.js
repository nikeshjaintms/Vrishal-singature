import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";

// ---------- GET ALL MATERIAL MTO ----------
// export const getAllMaterialControlList = createAsyncThunk(
//   "MaterialControlList/getAll",
//   async ({ project, search = "", page , limit, status }, { rejectWithValue }) => {
//     try {
//       const body = { project, search, page, limit };
//       if (status !== undefined && status !== null && status !== "") {
//         body.status = status;
//       }

//       const response = await axios.get(
//         `${V_URL}/user/get-material-control-items`,
//         body,
//         { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
//       );

//       if (response.data.success) {
//         return response.data.data; // return only the data part
//       } else {
//         return rejectWithValue(response.data.message);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error fetching MTOs");
//       return rejectWithValue(err.message);
//     }
//   }
// );
export const getAllMaterialControlList = createAsyncThunk(
  "MaterialControlList/getAll",
  async ({ project, search = "", page, limit, status }, { rejectWithValue }) => {
    try {
      const params = { project, search, page, limit };

      if (status !== undefined && status !== null && status !== "") {
        params.status = status;
      }

      const response = await axios.get(
        `${V_URL}/user/get-material-control-items`,
        {
          params,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );
      // console.log("API RESPONSE FULL:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching MTOs");
      return rejectWithValue(err.message);
    }
  }
);


// ---------- GET MATERIAL MTO BY ID ----------
export const getMaterialControlListById = createAsyncThunk(
  "MaterialControlList/getById",
  async (payload, { rejectWithValue }) => {
    try {
      const id = payload.id; // extract the id
      console.log("getMaterialControlListById called with id:", id);
      const response = await axios.post(
        `${V_URL}/user/material/get-material-mto-by-id`,
        { id },
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching MTO");
      return rejectWithValue(err.message);
    }
  }
);

// ---------- CREATE / UPDATE MATERIAL MTO ----------
export const manageMaterialMto = createAsyncThunk(
  "materialMto/manage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/user/material/manage-material-mto`,
        payload,
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error managing MTO");
      return rejectWithValue(err.message);
    }
  }
);


// ---------- SLICE ----------
const MaterialControlListSlice = createSlice({
  name: "materialMto",
  initialState: {
    list: [],        // ✅ ARRAY
    single: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ================= GET ALL =================
      .addCase(getAllMaterialControlList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllMaterialControlList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(getAllMaterialControlList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })

      // ================= GET BY ID =================
      .addCase(getMaterialControlListById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialControlListById.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
      })
      .addCase(getMaterialControlListById.rejected, (state, action) => {
        state.single = null;
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE / UPDATE =================
      .addCase(manageMaterialMto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageMaterialMto.fulfilled, (state, action) => {
        state.single = action.payload;
        state.loading = false;
      })
      .addCase(manageMaterialMto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default MaterialControlListSlice.reducer;
