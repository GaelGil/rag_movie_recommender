import { Link } from "@tanstack/react-router";
import { PROJECT_NAME } from "../../data/ProjectName";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { Anchor, Text, Group, Image, Box, Button } from "@mantine/core";
// import { useUser } from "../../context/UserContext";
// import { logout } from "../../api/auth";
const Navbar = () => {
  // const navigate = useNavigate();
  // const [loading, setLoading] = useState<boolean>();
  // const [isOpen, setIsOpen] = useState(false);
  // const { user, setUser } = useUser();

  // const handleLogout = async () => {
  //   localStorage.removeItem("token");
  //   try {
  //     setLoading(true);
  //     await logout();
  //     setUser(null);
  //   } catch (error) {
  //     alert(`error logging out: ${error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  //   console.log(loading);
  //   navigate("/auth/login");
  // };

  return (
    <Box
      px="xl"
      py="sm"
      bg="black"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
    >
      {" "}
      <Group align="center" maw={1200} m="0 auto" gap="xl">
        <Anchor
          component={Link}
          to="/"
          display="flex"
          underline="never"
          style={{ alignItems: "center" }}
        >
          <Image
            src={PROJECT_LOGO}
            alt="Logo"
            maw={60}
            p={2}
            className="w-24 h-12 object-contain"
          />
          <Text c="var(--mantine-color-text-primary)" fz="xl" fw={700} ml="sm">
            {PROJECT_NAME}
          </Text>
        </Anchor>

        <Box style={{ flex: 1 }} />
        {/* Desktop nav */}
        <Group align="center" gap="md">
          {" "}
          {/* {!user ? (
            <Link className="text-decoration-none" to="/auth/login">
              <span className="text-primary-600">Chat</span>
            </Link>
          ) : ( */}
          <Anchor component={Link} underline="never" to="/chat">
            <Button radius="xl" variant="outline">
              Chat
            </Button>
          </Anchor>
          {/* )} */}
          <Anchor component={Link} underline="never" to="/auth/login">
            <Button radius="xl" variant="outline">
              Log In
            </Button>
          </Anchor>
        </Group>
      </Group>
    </Box>
  );
};

export default Navbar;
