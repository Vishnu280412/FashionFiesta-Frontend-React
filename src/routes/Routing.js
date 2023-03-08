import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../screens/auth/AdminLogin";
import Products from "../screens/dashboard/Products";
import Categories from "../screens/dashboard/Categories";
import Private from "./Private";
import Public from "./Public";
import CreateCategory from "../screens/dashboard/CreateCategory";
import UpdateCategory from "../screens/dashboard/UpdateCategory";
import CreateProduct from "../screens/dashboard/CreateProduct";
import EditProduct from "../screens/dashboard/EditProduct";
import Orders from "../screens/dashboard/Orders";
import Home from "../screens/home/Home";
import Login from "../screens/home/auth/Login";
import Register from "../screens/home/auth/Register";
import Dashboard from "../screens/users/Dashboard";
import UserRoute from "./UserRoute";
import UserAuthRoute from "./UserAuthRoute";
import CatProducts from "../screens/home/CatProducts";
import Product from "../screens/home/Product";
import SearchProducts from "../screens/home/SearchProducts";
import Cart from "../screens/home/Cart";
import Wishlist from "../screens/home/Wishlist";
import OrderDetails from "../screens/dashboard/OrderDetails";
import UserOrders from "../screens/users/UserOrders";
import UserOrderDetails from "../screens/users/UserOrderDetails";

const Routing = () => {
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="cat-products/:name" element={<CatProducts />} />
            <Route path="cat-products/:name/:page" element={<CatProducts />} />
            <Route path="search-products/:keyword/:page" element={<SearchProducts />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="product/:id" element={<Product />} />
            <Route element={<UserAuthRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
            <Route element={<UserRoute />}>
                <Route path="user" element={<Dashboard />} />
                <Route path="orders" element={<UserOrders />} />
                <Route path="orders/:page" element={<UserOrders />} />
                <Route path="user-order-details/:id" element={<UserOrderDetails />} />
            </Route>
            
            <Route path="auth">
                <Route path="admin-login" element={<Public><AdminLogin /></Public>} />
            </Route>

            <Route path="dashboard">
                <Route path="products" element={<Private><Products /></Private>} />
                <Route path="products/:page" element={<Private><Products /></Private>} />
                <Route path="create-product" element={<Private><CreateProduct /></Private>} />
                <Route path="edit-product/:id" element={<Private><EditProduct /></Private>} />

                <Route path="categories" element={<Private><Categories /></Private>} /> 
                <Route path="categories/:page" element={<Private><Categories /></Private>} />
                <Route path="create-category" element={<Private><CreateCategory /></Private>} />
                <Route path="update-category/:id" element={<Private><UpdateCategory /></Private>} />
                
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:page" element={<Orders />} />
                <Route path="order-details/:id" element={<OrderDetails />} />

            </Route>
        </Routes>
        </BrowserRouter>
    )
}

export default Routing;