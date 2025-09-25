import HomeBanner from "../components/Home/HomeBanner";
import Navigation from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";
const HomePage: React.FC = () => {
  return (
    <>
      <Navigation />
      <HomeBanner />
      <Footer />
    </>
  );
};

export default HomePage;
