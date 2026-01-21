import { Container, AppShell, Group } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ScatterPlot } from "@/components/ScatterPlot";
export const Route = createFileRoute("/")({
  component: Graph3D,
});

function Graph3D() {
  return (
    <AppShell layout="alt" header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container>
          <Group h="100%" p="md" justify="flex-start">
            <Link to="/">Home</Link> <Link to="/">Github</Link>{" "}
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <ScatterPlot />
      </AppShell.Main>
    </AppShell>
  );
}
