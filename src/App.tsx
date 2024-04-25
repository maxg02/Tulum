import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./sections/RootLayout";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
        },
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
