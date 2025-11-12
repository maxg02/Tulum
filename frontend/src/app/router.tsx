import RootLayout from "../components/Layout/RootLayout";
import Dashboard from "./routes/Dashboard";
import Income from "./routes/Income";
import Expenses from "./routes/Expenses";
import Savings from "./routes/Savings";
import Login from "./routes/Login";
import Register from "./routes/Register";
import { createBrowserRouter, json } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import VerifyEmail from "./routes/VerifyEmail";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorPage />,
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
        {
            path: "/verify-email",
            element: <VerifyEmail />,
            loader: ({ request }) => {
                const url = new URL(request.url);
                const token = url.searchParams.get("token");
                if (!token) throw json({ message: "Missing token" }, { status: 404 });
                return { token };
            },
            errorElement: <ErrorPage />,
        },
    ],
    {
        basename: import.meta.env.BASE_URL, // Use the base URL from environment variables
    }
);
export default router;
