import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { CustomProvider } from "./components/ui/provider";
import { routeTree } from "./routeTree.gen";
import "./main.css";

// const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomProvider>
      <RouterProvider router={router} />
    </CustomProvider>
  </StrictMode>
);
