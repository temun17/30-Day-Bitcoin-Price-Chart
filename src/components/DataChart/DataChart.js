import React from "react";
import "./DataChart.css";

const DataChart = props => {
  // GET X & Y || MAX & MIN
  const getX = () => {
    const { data } = props;
    return {
      min: data[0].index,
      max: data[data.length - 1].index
    };
  };
  const getY = () => {
    const { data } = props;
    return {
      min: data.reduce(
        (min, price) => (price.numerical < min ? price.numerical : min),
        data[0].numerical
      ),
      max: data.reduce(
        (max, price) => (price.numerical > max ? price.numerical : max),
        data[0].numerical
      )
    };
  };

  // GET SVG COORDINATES
  const getSvgX = index => {
    const { svgWidth, yLabelSize } = props;
    return yLabelSize + (index / getX().max) * (svgWidth - yLabelSize);
  };
  const getSvgY = numerical => {
    const { svgHeight, xLabelSize } = props;
    const gY = getY();
    return (
      ((svgHeight - xLabelSize) * gY.max -
        (svgHeight - xLabelSize) * numerical) /
      (gY.max - gY.min)
    );
  };

  // BUILD SVG PATH
  const makePath = () => {
    const { color, data } = props;
    let pathD =
      "M " + getSvgX(data[0].index) + " " + getSvgY(data[0].numerical) + " ";

    pathD += data
      .map((point, i) => {
        return (
          "L " + getSvgX(point.index) + " " + getSvgY(point.numerical) + " "
        );
      })
      .join("");

    return (
      <path className="linechart_path" d={pathD} style={{ stroke: color }} />
    );
  };

  // BUILD SVG SHADED AREA
  const makeArea = () => {
    const { data } = props;
    let pathD =
      "M " + getSvgX(data[0].index) + " " + getSvgY(data[0].numerical) + " ";

    pathD += data
      .map((point, i) => {
        return (
          "L " + getSvgX(point.index) + " " + getSvgY(point.numerical) + " "
        );
      })
      .join("");

    const x = getX();
    const y = getY();
    pathD +=
      "L " +
      getSvgX(x.max) +
      " " +
      getSvgY(y.min) +
      " " +
      "L " +
      getSvgX(x.min) +
      " " +
      getSvgY(y.min) +
      " ";

    return <path className="linechart_area" d={pathD} />;
  };

  // BUILD GRID AXIS
  const makeAxis = () => {
    const { yLabelSize } = props;
    const x = getX();
    const y = getY();

    return (
      <g className="linechart_axis">
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.min)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.min)}
          strokeDasharray="5"
        />
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.max)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.max)}
          strokeDasharray="5"
        />
      </g>
    );
  };

  // X & Y CHART LABELS
  const makeLabels = () => {
    const { svgHeight, svgWidth, xLabelSize, yLabelSize } = props;
    const padding = 5;

    return (
      <g className="linechart_label">
        {/* Y AXIS LABELS */}
        <text transform={`translate(35, 20)`} textAnchor="middle">
          {getY().max.toLocaleString("us-EN", {
            style: "currency",
            currency: "USD"
          })}
        </text>
        <text
          transform={`translate(35, ${svgHeight - xLabelSize - padding})`}
          textAnchor="middle"
        >
          {getY().min.toLocaleString("us-EN", {
            style: "currency",
            currency: "USD"
          })}
        </text>
        <div className="space"></div>

        {/* X AXIS LABELS */}
        <text
          transform={`translate(${yLabelSize}, ${svgHeight})`}
          textAnchor="start"
        >
          {props.data[0].date}
        </text>
        <text
          transform={`translate(${svgWidth}, ${svgHeight})`}
          textAnchor="end"
        >
          {props.data[props.data.length - 1].date}
        </text>
      </g>
    );
  };

  // MAKE ACTIVE SUBQUERY POINTS
  const makeActivePoint = () => {
    const { pointRadius, userInput } = props;

    const activePoints = userInput.map((point, i) => {
      return (
        <circle
          key={i}
          className="linechart_point"
          style={{ stroke: "black", opacity: "0.9" }}
          r={pointRadius}
          cx={getSvgX(point.index)}
          cy={getSvgY(point.numerical)}
        />
      );
    });

    return <React.Fragment>{activePoints}</React.Fragment>;
  };

  // Destructuring Default Props
  const { svgHeight, svgWidth } = props;

  return (
    <div className="container">
      <svg
        width={1200}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className={"linechart"}
      >
        <g>
          {makeAxis()}
          {makePath()}
          {makeArea()}
          {makeLabels()}
          {makeActivePoint()}
        </g>
      </svg>
    </div>
  );
};

// DEFAULT PROPS
DataChart.defaultProps = {
  color: "yellow",
  pointRadius: 7,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80
};

export default DataChart;
