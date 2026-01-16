import Plotly from "plotly.js-dist-min";
import d3 from "d3";

d3.csv(
  "https://raw.githubusercontent.com/plotly/datasets/master/alpha_shape.csv"
).then((rows) => {
  const unpack = (rows: any[], key: string) => rows.map((r) => Number(r[key])); // convert strings to numbers

  var data: Plotly.Data[] = [
    {
      x: unpack(rows, "x"),
      y: unpack(rows, "y"),
      z: unpack(rows, "z"),
      mode: "markers",
      type: "scatter3d", // Change this to "box" if you want to use the BoxPlotData type
      marker: {
        color: "rgb(23, 190, 207)",
        size: 2,
      },
    },
    {
      // alphahull: 7,
      opacity: 0.1,
      type: "mesh3d",
      x: unpack(rows, "x"),
      y: unpack(rows, "y"),
      z: unpack(rows, "z"),
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    autosize: true,
    height: 480,
    scene: {
      aspectratio: {
        x: 1,
        y: 1,
        z: 1,
      },
      camera: {
        center: {
          x: 0,
          y: 0,
          z: 0,
        },
        eye: {
          x: 1.25,
          y: 1.25,
          z: 1.25,
        },
        up: {
          x: 0,
          y: 0,
          z: 1,
        },
      },
      xaxis: {
        type: "linear",
        zeroline: false,
      },
      yaxis: {
        type: "linear",
        zeroline: false,
      },
      zaxis: {
        type: "linear",
        zeroline: false,
      },
    },
    title: {
      text: "3d point clustering",
    },
    width: 477,
    xaxis: {
      type: "linear",
      zeroline: false,
    },
    yaxis: {
      type: "linear",
      zeroline: false,
    },
    colorway: ["rgb(23, 190, 207)"],
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 4,
    },
    showlegend: false,
    paper_bgcolor: "rgb(0,0,0)",
    plot_bgcolor: "rgb(0,0,0)",
  };

  Plotly.newPlot("myDiv", data, layout);
});
