import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/Layout/NavBar";
import HomeBanner from "../components/Home/HomeBanner";
import Footer from "../components/Layout/Footer";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <HomeBanner />
      <Footer />
    </>
  );
}
