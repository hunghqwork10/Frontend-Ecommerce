import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderHistory from "@/pages/OrderHistory";
import OrderDetail from "@/pages/OrderDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductList /> },
      { path: "laptop", element: <ProductList /> },
      { path: "phone", element: <ProductList /> },
      { path: "tablet", element: <ProductList /> },
      { path: "accessories", element: <ProductList /> },
      { path: "sale", element: <ProductList /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "orders", element: <OrderHistory /> },
      { path: "orders/:id", element: <OrderDetail /> },
    ],
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
