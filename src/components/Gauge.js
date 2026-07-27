import GaugeChart from "react-gauge-chart";

const chartStyle = { width: "40%" };

// Temperature gauge; `percent` is a 0..1 position on the fixed -30..50°C scale.
export default function Gauge({ percent }) {
  return (
    <div id="outer-div">
      <GaugeChart
        id="gauge-chart1"
        nrOfLevels={20}
        percent={percent}
        textColor="#000000"
        hideText={true} // This will remove the percentage text
        style={chartStyle}
      />
    </div>
  );
}
