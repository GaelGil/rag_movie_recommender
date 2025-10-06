import {
  Box,
  Text,

} from "@mantine/core"
import { PROJECT_NAME } from "@/const";
export function Footer() {
  return (
    <Box px="xl" py="xl" bg={"var(--mantine-color-black)"}>



      <Text c="dimmed" size="sm">
        &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
      </Text>
    </Box>
  );
}
export default Footer;
