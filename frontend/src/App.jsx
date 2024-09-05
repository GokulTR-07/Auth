import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/UserContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductSection from "./components/product/ProductSection";
import Chatbot from "./components/Chatbot/ChatBot";
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./components/product/CheckOutPage";
import PaymentPage from "./components/payment/PaymentPage";
import PaymentSuccessPage from "./components/payment/PaymentSuccessPage";
import OrderTracking from "./components/order/OrderTracking";
import OrderHistory from "./components/order/OrderHistory";
import DashboardLayout from "./components/UserDashboard/DashboardLayout";
import Profile from "./components/UserDashboard/Profile";
import Orders from "./components/UserDashboard/Orders";
import Settings from "./components/UserDashboard/Settings";
import History from "./components/UserDashboard/History";
import AdminDashboard from "./components/Admin/AdminDashboard";
import MarketerForm from "./pages/MarketerForm";
import MarketerDashboard from "./components/marketer/MarketerDashboard";
import RegisterWholesaler from "./components/WholeSaler/RegisterWholeSaler";
import Analytics from "./components/Admin/analytics/Analytics";
import ForbiddenPage from "./components/ProtectedRoute/ForbiddenPage";
import ProtectedRoute from "./components/ProtectedRoute/ProductedRoute";
import UserOrders from "./components/Admin/UserOrders";
import Wholesaler from "../../backend/models/wholesaler";
import TelecallerOrders from "./components/Admin/TelecallerOrders";
import ProductList from "./components/Admin/ProductList";
import AllUsers from "./components/Admin/AllUsers";
import AllMarketers from "./components/Admin/AllMarketers";
import AllWholesalers from "./components/Admin/AllWholesalers";
import DefaultDashboard from "./components/Admin/DefaultDashboard";
import WholesalerOrders from "./components/Admin/WholesalerOrders";
import AdminProfile from "./components/Admin/AdminProfile";
import AdminSetting from "./components/Admin/AdminSetting";
import TeleCallerDashboard from "./components/Telecaller/TeleCallerDashboard";
import SingleProduct from "./components/product/SingleProduct";
import CardProduct from "./components/product/CardProduct";
import ProductPage from "./components/product/ProductPage";
// import Login from "./components/login/Login"

function App() {
  return (
    <UserContextProvider>
      <CartProvider>
        <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/singleproduct" element={<SingleProduct />} />
          <Route path="/card-product" element={<CardProduct />} />
          <Route path="/productpage" element={<ProductPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route
            path="/product/:id"
            element={
              // <ProtectedRoute allowedRoles={["user", "wholesaler", "admin"]}>
                <ProductSection />
              // {/* </ProtectedRoute>  */}
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          {/* userDashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="track-order/:id"
              element={
                <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="history/:userId"
              element={
                <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={["user", "wholesaler"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DefaultDashboard />} />
            <Route path="user-orders" element={<UserOrders />} />
            <Route path="wholesaler-orders" element={<WholesalerOrders />} />
            <Route path="telecaller-orders" element={<TelecallerOrders />} />
            <Route path="all-products" element={<ProductList />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="all-marketers" element={<AllMarketers />} />
            <Route path="all-wholesalers" element={<AllWholesalers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSetting />} />
          </Route>

          <Route
            path="/register-marketer"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MarketerForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketer-dashboard/:id"
            element={
              <ProtectedRoute allowedRoles={["marketer"]}>
                <MarketerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-wholesaler/:id"
            element={
              <ProtectedRoute allowedRoles={["marketer"]}>
                <RegisterWholesaler />
              </ProtectedRoute>
            }
          />
          <Route path='/telecaller-dashboard' element={<ProtectedRoute allowedRoles={["telecaller"]}><TeleCallerDashboard/></ProtectedRoute>}/>
        </Routes>
      </CartProvider>
    </UserContextProvider>
  );
}

export default App;
