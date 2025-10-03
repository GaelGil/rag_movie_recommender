import {
  Container,
  Text,
  Image,
  TextInput,
  Stack,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { PROJECT_LOGO } from "../../data/ProjectLogo";
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
});

function SignUp() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password should be at least 8 characters" : null,
      name: (value) =>
        value.length < 3 ? "Name should be at least 3 characters" : null,
    },
  });

  return (
    <Container
      size="xs"
      justify-content="center"
      align-items="center"
      pt={"xl"}
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {" "}
        <Stack pt={"xl"}>
          <Image src={PROJECT_LOGO} alt="FastAPI logo" maw={120} mx="auto" />

          <TextInput
            withAsterisk
            label="Name"
            leftSection={<FiUser size={20} />}
            placeholder="Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Email"
            leftSection={<FiMail size={20} />}
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <TextInput
            withAsterisk
            label="Password"
            leftSection={<FiLock size={20} />}
            placeholder="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <Button
            variant="solid"
            type="submit"
            // loading={isSubmitting}
            size="md"
          >
            Log In
          </Button>

          <Text ta="center" size="sm">
            Don&apos;t have an account?{" "}
            <RouterLink to="/auth/login" color="blue">
              Log In
            </RouterLink>
          </Text>
        </Stack>
      </form>
    </Container>
  );
}
