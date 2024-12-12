import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./sections/RootLayout";
import Dashboard from "./sections/Dashboard";
import Income from "./sections/Income";
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
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
