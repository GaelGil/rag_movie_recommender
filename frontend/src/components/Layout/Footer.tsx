import { Box, Text } from "@mantine/core";

import { PROJECT_NAME } from "../../data/ProjectName";
export function Footer() {
  return (
    <Box px="xl" py="xl" bg={"var(--mantine-color-black)"}>
      <Text c="dimmed" size="sm">
        &copy; {new Date().getFullYear()} {PROJECT_NAME}.
      </Text>
    </Box>
  );
}
export default Footer;
