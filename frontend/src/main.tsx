import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./Login";
import Events from "./pages/Events";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "/",
        element: <Navigate to="/events" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
