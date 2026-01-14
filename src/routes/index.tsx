// routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";

// import { useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { WebGLRenderer } from "three";
// import SpriteText from "three-spritetext";
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
// import { WebGLRenderer } from "three";
function Graph3D() {
  // const fgRef = useRef<ForceGraphMethods>();

  return (
    <ForceGraph3D
      rendererConfig={{ antialias: true }}
      renderer={new WebGLRenderer()}
      graphData={{ nodes: [{ id: 1 }], links: [] }}
    />
  );
}
