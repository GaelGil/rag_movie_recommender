// routes/index.tsx
import { Container, SimpleGrid, Text, Box } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";

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
    <Container w="100%" bg="red">
      <SimpleGrid cols={100} spacing={0} verticalSpacing={0}>
        {data.nodes.map((node) => (
          <Box key={node.id} bd={"1px solid black"}>
            <Text>{node.label}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
