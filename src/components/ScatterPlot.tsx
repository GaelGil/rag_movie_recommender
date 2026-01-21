import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import * as d3 from "d3";
import { Container } from "@mantine/core";

export const ScatterPlot: React.FC = () => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // load CSV data
    d3.csv(
      "https://raw.githubusercontent.com/plotly/datasets/master/alpha_shape.csv",
    )
      .then((rows) => {
        const unpack = (rows: any[], key: string) =>
          rows.map((r) => Number(r[key]));

        const data: Plotly.Data[] = [
          {
            x: unpack(rows, "x"),
            y: unpack(rows, "y"),
            z: unpack(rows, "z"),
            mode: "markers",
            type: "scatter3d",
            marker: { color: "rgb(23,190,207)", size: 2 },
          },
          {
            type: "mesh3d",
            opacity: 0.1,
            x: unpack(rows, "x"),
            y: unpack(rows, "y"),
            z: unpack(rows, "z"),
          },
        ];

        const layout: Partial<Plotly.Layout> = {
          autosize: true,
          height: 500,
          scene: {
            aspectratio: { x: 1, y: 1, z: 1 },
            camera: {
              center: { x: 0, y: 0, z: 0 },
              eye: { x: 1.25, y: 1.25, z: 1.25 },
              up: { x: 0, y: 0, z: 1 },
            },
            xaxis: { type: "linear", zeroline: false },
            yaxis: { type: "linear", zeroline: false },
            zaxis: { type: "linear", zeroline: false },
          },
          title: { text: "3D Point Clustering" },
          //   margin: { l: 0, r: 0, b: 0, t: 0, pad: 4 },
          showlegend: false,
          paper_bgcolor: "rgba(255, 16, 16, 0)",
          plot_bgcolor: "rgb(38, 255, 0)",
        };

        // render plot
        if (plotRef.current) {
          Plotly.newPlot(plotRef.current, data, layout);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return <Container bg="red" w="100%" h="500px" ref={plotRef} />;
};
