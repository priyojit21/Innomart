import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../middleware/axiosInterceptor";

const accessToken = localStorage.getItem("accessToken");

// Fetch All Orders
export const showUser = createAsyncThunk(
  "productDetail/showUser",
  async ({ search = "", searchBy = "", sortOrder = "", sortField = "", page = 1, status = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("http://localhost:3000/order/getAllOrder", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { search, searchBy, sortOrder, sortField, page, status },
      });
      return {
        data: response.data.data,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        append: page > 1,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Fetch Wishlist
export const showWishlist = createAsyncThunk(
  "productDetail/showWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/product/wishlist",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "productDetail/addToWishlist",
  async ({ productId, variationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "http://localhost:3000/product/addWishlist",
        { productId, variationId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return { productId, variationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "productDetail/removeFromWishlist",
  async ({ productId, variationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `http://localhost:3000/product/removeWishlist/${productId}/${variationId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return { productId, variationId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Cart Items
export const handleCartItems = createAsyncThunk(
  "productDetail/handleCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/cart/getAllCartItems",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const updatedCartItems = response.data.updatedCartItems || [];
      const cartIds = updatedCartItems.map((item) => item._id);
      const prodIds = updatedCartItems.map((item) => item.productId);
      const varIds = updatedCartItems.map((item) => item.variationId);
      return { updatedCartItems, cartIds, prodIds, varIds };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productDetail = createSlice({
  name: "productDetail",
  initialState: {
    orders: [],
    wishlistItems: [],
    cartItems: [],
    cartIds: [],
    prodIds: [],
    varIds: [],
    loading: false,
    error: null,
    searchData: "",
    selectedOption: "",
    debouncedSearch: "",
    statusState: "",
    sortOrder: "",
    sortField: "",
    productCount: 0,
    currentPage: 1,
    totalPages: 1,
  },

  reducers: {
    searchProduct: (state, action) => {
      state.searchData = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setStatusState: (state, action) => {
      state.statusState = action.payload;
    },
    setDebouncedSearch: (state, action) => {
      state.debouncedSearch = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setProductCount: (state, action) => {
      state.productCount = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Orders
      .addCase(showUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(showUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;

        if (action.payload.append) {
          state.orders = [...state.orders, ...action.payload.data];
        } else {
          state.orders = action.payload.data;
        }
      })
      .addCase(showUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Wishlist
      .addCase(showWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(showWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
        state.error = null;
      })
      .addCase(showWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        const { productId, variationId } = action.payload;
        const alreadyExists = state.wishlistItems.some(
          (item) => item.productId === productId
        );
        if (!alreadyExists) {
          state.wishlistItems.push({ productId, variationId });
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.variationId === action.payload.variationId
            )
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Cart
      .addCase(handleCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.updatedCartItems;
        state.cartIds = action.payload.cartIds;
        state.prodIds = action.payload.prodIds;
        state.varIds = action.payload.varIds;
        state.productCount = action.payload.updatedCartItems.length;
        state.error = null;
      })
      .addCase(handleCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  searchProduct,
  setSelectedOption,
  setStatusState,
  setDebouncedSearch,
  setSortOrder,
  setSortField,
  setProductCount,
} = productDetail.actions;

export default productDetail.reducer;
