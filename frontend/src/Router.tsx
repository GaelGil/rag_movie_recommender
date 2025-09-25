import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/Profile";

import Chat from "./pages/Chat";
import LogInPage from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    element: <LogInPage />,
  },

  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  {
    // Protected routes wrapper
    element: <PrivateRoute />,
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/profile/:userId",
        element: <ProfilePage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
