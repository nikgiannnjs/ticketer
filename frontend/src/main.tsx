import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Login from "./Login";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Register from "./pages/Register";
import AccessRequests from "@/pages/AccessRequests";
import { SuperAdminRoute } from "@/components/SuperAdminRoute";
import EventDetails from "@/pages/EventDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import { PaymentRoute } from "@/components/PaymentRoute";

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
        path: "create-event",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Navigate to="/events" replace />,
      },
      {
        path: "/access-requests",
        element: (
          <SuperAdminRoute>
            <AccessRequests />
          </SuperAdminRoute>
        ),
      },
      {
        path: "/event/:id",
        element: <EventDetails />,
      },
      {
        path: "/payment-success",
        element: (
          <PaymentRoute>
            <PaymentSuccess />
          </PaymentRoute>
        ),
      },
      {
        path: "/payment-fail",
        element: (
          <PaymentRoute>
            <PaymentFailed />
          </PaymentRoute>
        ),
      },
      {
        path: "/edit-event/:id",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
