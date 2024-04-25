import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./sections/RootLayout";
import Dashboard from "./sections/Dashboard";
import Budget from "./sections/Budget";
import Expenses from "./sections/Expenses";
import Savings from "./sections/Savings";

function App() {
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
                    path: "/budget",
                    element: <Budget />,
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
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
