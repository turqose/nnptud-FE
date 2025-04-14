import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "../features/address/addressSlice";
import blogPostsReducer from "../features/blogs/blogSlice";
import cartReducer from "../features/cart/cartSlice";
import blogCategoriesReducer from "../features/categoryBlog/categoryBlogSlice";
import categoryProductsReducer from "../features/categoryProduct/categoryProductSlice";
import contactReducer from "../features/contact/contactSlice";
import ordersReducer from "../features/orders/orderSlice";
import productsReducer from "../features/product/productSlice";
import { authApi } from "../features/user/authService";
import authReducer from "../features/user/userSlice";
import bannerReducer from "../features/banner/bannerSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    products: productsReducer,
    orders: ordersReducer,
    categoryProducts: categoryProductsReducer,
    blogPosts: blogPostsReducer,
    blogCategories: blogCategoriesReducer,
    contact: contactReducer,
    banners: bannerReducer,

    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
