// routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, Box, Text } from "@mantine/core";
type Node = {
  id: string;
  label: string;
};

type Link = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: Node[];
  links: Link[];
};

export const Route = createFileRoute("/")({
  component: Graph3D,
});

const data: GraphData = {
  nodes: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C" },
  ],
  links: [
    { source: "a", target: "b" },
    { source: "a", target: "c" },
  ],
};
function Graph3D() {
  return (
    <Container
      fluid
      style={{ display: "flex", flexDirection: "column" }}
      w="75%"
      h="100%"
    >
      <Box
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        px="md"
        w="100%"
        display={"flex"}
      >
        <Text c="red">Graph 3D</Text>
      </Box>
    </Container>
  );
}
