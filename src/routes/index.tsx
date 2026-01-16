import { Container, AppShell, Group } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Scatter3DPlot } from "@/components/myGrid";
import Grid from "@/components/Common/Grid";
export const Route = createFileRoute("/")({
  component: Graph3D,
});

function Graph3D() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (index: number) => {
    if (isOpen) {
      setHoveredId(null);
    } else {
      setIsOpen(!isOpen);
    }

    setHoveredId(String(index));
  };

  console.log(hoveredId);
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
        {/* <Grid
          hoveredId={hoveredId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleClick={handleClick}
        /> */}
        <Scatter3DPlot />
      </AppShell.Main>
    </AppShell>
  );
}
