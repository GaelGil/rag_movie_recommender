import { Container, SimpleGrid, Box, AppShell, Group } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Graph3D,
});
const n = 10000;
const grid = Array.from({ length: n }, () => Array(50).fill(" ")); // generate array

function Graph3D() {
  return (
    <AppShell layout="alt" header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container>
          <Group h="100%" p="md" justify="flex-start">
            <Link to="/">Home</Link>{" "}
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <SimpleGrid cols={100} spacing={0} verticalSpacing={0}>
          {grid.map((_, idx) => (
            <Box
              key={idx}
              bd={"1px solid black"}
              h="10px"
              w="10px"
              p={0}
              m={0}
            ></Box>
          ))}
        </SimpleGrid>
      </AppShell.Main>
    </AppShell>
  );
}
