import RootLayout from "../components/Layout/RootLayout";
import Dashboard from "./routes/Dashboard";
import Income from "./routes/Income";
import Expenses from "./routes/Expenses";
import Savings from "./routes/Savings";
import Login from "./routes/Login";
import Register from "./routes/Register";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/income",
                element: <Income />,
            },
            {
                path: "/expenses",
                element: <Expenses />,
            },
            {
                path: "/savings",
                element: <Savings />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);
export default router;
