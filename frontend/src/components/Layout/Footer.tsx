// import { Link } from "react-router-dom";
import { PROJECT_NAME } from "../../data/ProjectName";
import { NAME } from "../../data/Name";
import { FaHeart } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="py-6 text-center text-secondary-300">
      {PROJECT_NAME} Made with{" "}
      <FaHeart className="text-secondary-300 inline-block mr-1" /> by {NAME}
    </footer>
  );
};

export default Footer;
