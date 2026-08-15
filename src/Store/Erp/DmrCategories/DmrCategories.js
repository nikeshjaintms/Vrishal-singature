import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

export const getDmrCategories = createAsyncThunk("/party/getDmrCategories", async () => {
  try {
    const project = localStorage.getItem("U_PROJECT_ID");
    const myurl = `${V_URL}/user/dmr-categories/get-dmr-categories`;
    
    const response = await axios({
      method: "post",
      url: myurl,
      data: {project},
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });
    const data = response.data;
    if (data.success === true) {
      console.log(data, "getDmrCategories");
      return data;
    } else {
      throw new Error(data);
    }
  } catch (error) {
    console.log(error, "error");
    toast.error(error.response.data.message);
    return error;
  }
});

export const addDmrCategory = createAsyncThunk(
  "/party/addDmrCategory",
  async (categoryData) => {
    try {
      const project = localStorage.getItem("U_PROJECT_ID");
      const myurl = `${V_URL}/user/manage-dmr-category`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: {
          name: categoryData.name,
          project: project
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });
      const data = response.data;
      if (data.success === true) {
        toast.success(data?.message);
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
      return error;
    }
  }
);

const getDmrCategoriesSlice = createSlice({
  name: "getDmrCategories",
  initialState: {
    categories: [],      // <-- more descriptive
    loading: false,
    error: null,
    message: "",         // optional: to store the success message
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDmrCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "";
      })
      .addCase(getDmrCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data.categories; // Extracting the array
        state.message = action.payload.message;
        state.loading = false;
        state.error = null;
      })
      .addCase(getDmrCategories.rejected, (state, action) => {
        state.categories = [];
        state.loading = false;
        state.error = action.error.message;
        state.message = "";
      })
      .addCase(addDmrCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDmrCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally refresh the categories list
        // You might want to dispatch getDmrCategories here or handle it in the component
      })
      .addCase(addDmrCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

console.log(getDmrCategoriesSlice, "getDmrCategoriesSlice");

export default getDmrCategoriesSlice.reducer;
