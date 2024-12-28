import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartCount: 0,
  wishlistCount: 0,
};

const cartWishlistSlice = createSlice({
  name: 'cartWishlist',
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    setWishlistCount: (state, action) => {
      state.wishlistCount = action.payload;
    },
  },
});

export const { setCartCount, setWishlistCount } = cartWishlistSlice.actions;

export default cartWishlistSlice.reducer;
