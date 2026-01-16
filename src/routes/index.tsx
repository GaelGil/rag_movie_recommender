import { Container, SimpleGrid, Box, AppShell, Group } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import ItemMenu from "@/components/Common/ItemMenu";
export const Route = createFileRoute("/")({
  component: Graph3D,
});
const n = 10000;
const grid = Array.from({ length: n }, () => Array(50).fill(" ")); // generate array

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
        <SimpleGrid cols={100} spacing={0} verticalSpacing={0}>
          {grid.map((_, idx) => (
            <Box
              key={idx}
              bd={"1px solid black"}
              h={10}
              w={10}
              p={0}
              m={0}
              onClick={() => handleClick(idx)}
            >
              {isOpen && hoveredId === String(idx) && (
                <ItemMenu
                  value={String(idx)}
                  onClose={() => setIsOpen(false)}
                />
              )}
            </Box>
          ))}
        </SimpleGrid>
      </AppShell.Main>
    </AppShell>
  );
}
