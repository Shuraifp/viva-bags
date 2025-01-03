import { Routes, Route } from 'react-router-dom'
import Home from './pages/user/Home'
import Signin from './pages/user/Auth/Signin'
import Signup from './pages/user/Auth/Signup'
import Shop from './pages/user/Shop'
import ProductPage from './pages/user/ProductDetailsPage'
import UserManagement from './pages/admin/Customers'
import AdminDashboard from './pages/admin/Dashboard'
import OverView from './pages/admin/overview/OverView'
import Categories from './pages/admin/Categories'
import Products from './pages/admin/product/ProductsTable'
import OrderManagement from './pages/admin/Orders'
import AdminSignIn from './pages/admin/Auth/Signin'
import AddProduct from './pages/admin/product/AddProduct'
import ProfilePage from './pages/user/profile/Main'
import Address from './pages/user/profile/Address'
import Account from './pages/user/profile/Profile'
import Orders from './pages/user/profile/Orders'
import Wallet from './pages/user/profile/Wallet'
import { AuthProvider } from './context/AuthProvider' 
import Cart from './pages/user/cart/Cart'
import Wishlist from './pages/user/Wishlist'
import Checkout from './pages/user/checkout/Checkout'
import SuccessPage from './pages/user/Success'
import OrderDetails from './pages/user/profile/OrderDetails'
import Brands from './pages/admin/Brands'
import ForgotPassword from './pages/user/profile/ForgotPassword'
import PageNotFound from './pages/404PageNotFound'
import AdminOrderDetails from './pages/admin/OrderDetails'
import Coupons from './pages/admin/Coupons'
import Offers from './pages/admin/Offers'
import SalesReport from './pages/admin/SalesReport'

const App = () => {
  return (
    <AuthProvider>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<Account />} />
          <Route path="profileInfo" element={<Account />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<SuccessPage />} />
      
      <Route path='/admin/signin' element={<AdminSignIn />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<OverView />} />
        <Route path='overview' element={<OverView />} />
        <Route path="customers" element={<UserManagement />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="brands" element={<Brands />} />
        <Route path="Products" element={<Products />} />
        <Route path="Products/edit/:id" element={<AddProduct />} />
        <Route path="Products/new" element={<AddProduct />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="offers" element={<Offers />} />
        <Route path="sales" element={<SalesReport />} />
      </Route>
    </Routes>
    </AuthProvider>
  )
}

export default App
