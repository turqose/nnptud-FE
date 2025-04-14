import React, { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GlobalLoading from "./components/GlobalLoading/GlobalLoading";
import { ChatProvider } from "./context/ChatContext";
import BookingPage from "./pages/Booking/BookingPage";
import ConsultantMenu from "./pages/Consultants/ConsultantMenu";
import ConsultantPage from "./pages/Consultants/ConsultantPage";
 import ProtectedRoute from "./routing/ProtectedRoute";
import DatLichPage from "./pages/DatLich/DatLichPage";

const Layout = lazy(() => import("./layouts"));
const LayoutAdmin = lazy(() => import("./layouts/admin"));
const LayoutProfile = lazy(() => import("./layouts/profile"));
const AccountPage = lazy(() => import("./pages/Account/AccountPage"));
const AddAddressPage = lazy(() => import("./pages/Address/AddAddressPage"));
const AddressPage = lazy(() => import("./pages/Address/AddressPage"));
const AddBanner = lazy(() => import("./pages/Admin/Banner/AddBanner"));
const BannerList = lazy(() => import("./pages/Admin/Banner/BannerList"));

const CategoryList = lazy(() => import("./pages/Admin/Category/CategoryList"));
const ContactList = lazy(() => import("./pages/Admin/Contact/ContactList"));
const DashboardPage = lazy(() =>
  import("./pages/Admin/Dashboard/DashboardPage")
);
const OrderList = lazy(() => import("./pages/Admin/Order/OrderList"));
const AddPost = lazy(() => import("./pages/Admin/Post/AddPost"));
const AddPostCategory = lazy(() =>
  import("./pages/Admin/Post/AddPostCategory")
);
const PostCategoryList = lazy(() =>
  import("./pages/Admin/Post/PostCategoryList")
);
const PostList = lazy(() => import("./pages/Admin/Post/PostList"));
const AddProduct = lazy(() => import("./pages/Admin/Product/AddProduct"));
const ProductList = lazy(() => import("./pages/Admin/Product/ProductList"));
const UserList = lazy(() => import("./pages/Admin/Users/UserList"));
const ForgotPasswordPage = lazy(() =>
  import("./pages/Authentication/ForgotPasswordPage")
);
const OtpVerificationPage = lazy(() =>
  import("./pages/Authentication/OtpVerificationPage")
);
const SignInPage = lazy(() => import("./pages/Authentication/SignInPage"));
const SignUpPage = lazy(() => import("./pages/Authentication/SignUpPage"));
const SingleBlogPage = lazy(() => import("./pages/Blog/SingleBlogPage"));
const ContactPage = lazy(() => import("./pages/Contact/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/Error/NotFoundPage"));
const ImageSearchResult = lazy(() => import("./pages/Image/ImageSearchResult"));
const DetailOrderPage = lazy(() => import("./pages/myorder/DetailOrderPage"));
const MyOrderPage = lazy(() => import("./pages/myorder/MyOrderPage"));
const SettingPage = lazy(() => import("./pages/Setting/SettingPage"));
const SingleProductPage = lazy(() => import("./pages/Shop/SingleProductPage"));
const BlogPage = lazy(() => import("./pages/Blog/BlogPage"));
const CartPage = lazy(() => import("./pages/Cart/CartPage"));
const CheckoutPage = lazy(() => import("./pages/Checkout/CheckoutPage"));
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const ShopPage = lazy(() => import("./pages/Shop/ShopPage"));
const AddCategory = lazy(() => import("./pages/Admin/Category/AddCategory"));
const ChatBotFullScreen = lazy(() => import("./pages/Chat/ChatBotFullScreen"));
const ChatDetail = lazy(() => import("./pages/Chat/ChatDetail"));

function App() {
  return (
    <Router>
      <ChatProvider>
        <Suspense fallback={<GlobalLoading />}>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dat-lich" element={<DatLichPage />} />

              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<SingleBlogPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/consultants" element={<ConsultantMenu />} />
              <Route path="/consultants/consultant" element={<ConsultantPage />} />
              <Route path="/consultants/booking" element={<BookingPage />} />
              <Route path="/search" element={<ImageSearchResult />} />
              <Route path="/shop/:slug" element={<SingleProductPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<LayoutProfile />}>
                  <Route path="" element={<AccountPage />} />
                  <Route path="address" element={<AddressPage />} />
                  <Route path="setting" element={<SettingPage />} />
                  <Route path="address/add" element={<AddAddressPage />} />
                  <Route path="address/edit/:id" element={<AddAddressPage />} />
                  <Route path="orders" element={<MyOrderPage />} />
                  <Route path="orders/:id" element={<DetailOrderPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route path="" element={<DashboardPage />} />
              <Route path="banner" element={<BannerList />} />
              <Route path="add-banner" element={<AddBanner />} />
              <Route path="edit-banner/:id" element={<AddBanner />} />
              <Route path="product-list" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<AddProduct />} />
              <Route path="category-list" element={<CategoryList />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="edit-category/:id" element={<AddCategory />} />
              <Route path="post-list" element={<PostList />} />
              <Route path="post-category-list" element={<PostCategoryList />} />
              <Route path="add-post-category" element={<AddPostCategory />} />
              <Route
                path="edit-post-category/:id"
                element={<AddPostCategory />}
              />
              <Route path="add-post" element={<AddPost />} />
              <Route path="edit-post/:id" element={<AddPost />} />
              <Route path="contact-list" element={<ContactList />} />
              <Route path="order-list" element={<OrderList />} />
              <Route path="user-list" element={<UserList />} />
            </Route>
            <Route path="/chatbot-fullscreen" element={<ChatBotFullScreen />} />
            <Route path="/chat/:chatId/detail" element={<ChatDetail />} />
            <Route path="/chat/:chatId" element={<ChatBotFullScreen />} />

          </Routes>
        </Suspense>
      </ChatProvider>
    </Router>
  );
}

export default App;
