import { createBrowserRouter, RouterProvider } from "react-router";
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
        element: <Events />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
