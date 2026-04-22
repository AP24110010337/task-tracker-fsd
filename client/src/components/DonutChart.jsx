const CHART_SIZE = 168;
const STROKE_WIDTH = 18;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ title, data, totalLabel = "Tasks" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let offsetCursor = 0;

  const slices = data
    .filter((item) => item.value > 0)
    .map((item) => {
      const sliceLength = (item.value / total) * CIRCUMFERENCE;
      const slice = {
        ...item,
        dashArray: `${sliceLength} ${CIRCUMFERENCE - sliceLength}`,
        dashOffset: -offsetCursor
      };

      offsetCursor += sliceLength;
      return slice;
    });

  return (
    <div className="dashboard-chart content-panel">
      <div className="dashboard-chart__header">
        <h3 className="dashboard-chart__title">{title}</h3>
      </div>

      <div className="dashboard-chart__body">
        <div className="dashboard-chart__visual">
          <svg
            className="dashboard-chart__svg"
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            role="img"
            aria-label={title}
          >
            <circle
              cx={CHART_SIZE / 2}
              cy={CHART_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={STROKE_WIDTH}
            />

            {total > 0 &&
              slices.map((slice) => (
                <circle
                  key={slice.label}
                  cx={CHART_SIZE / 2}
                  cy={CHART_SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${CHART_SIZE / 2} ${CHART_SIZE / 2})`}
                />
              ))}
          </svg>

          <div className="dashboard-chart__center">
            <p className="dashboard-chart__center-value">{total}</p>
            <p className="dashboard-chart__center-label">{totalLabel}</p>
          </div>
        </div>

        <div className="dashboard-chart__legend">
          {data.map((item) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;

            return (
              <div key={item.label} className="dashboard-chart__legend-item">
                <div className="dashboard-chart__legend-main">
                  <span
                    className="dashboard-chart__legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="dashboard-chart__legend-label">{item.label}</span>
                </div>

                <div className="dashboard-chart__legend-values">
                  <span className="dashboard-chart__legend-count">{item.value}</span>
                  <span className="dashboard-chart__legend-percent">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
