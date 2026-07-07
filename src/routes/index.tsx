import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";

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
    ],
  },
]);
