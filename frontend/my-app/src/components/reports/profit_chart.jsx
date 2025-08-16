import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function ProfitChart() {
  // Months like the design (Sep -> Mar)
  const months = React.useMemo(() => ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], []);

  // Target data
  const revenueTarget = React.useMemo(() => [26000, 34000, 42000, 58000, 61000, 54000, 36000], []);
  const profitTarget = React.useMemo(() => [41000, 30000, 28000, 47000, 49000, 52000, 21000], []);

  // Animated data state
  const [revenue, setRevenue] = React.useState(Array(months.length).fill(0));
  const [profit, setProfit] = React.useState(Array(months.length).fill(0));

  React.useEffect(() => {
    let raf; const start = performance.now(); const duration = 700;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = ease(t);
      setRevenue(revenueTarget.map(v => Math.round(v * e)));
      setProfit(profitTarget.map(v => Math.round(v * e)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [revenueTarget, profitTarget]);

  const numberFmt = (n) => n.toLocaleString('en-US');

  return (
    <div className="profit_chart-container">
      <div className="profit-header">
        <h1>Profit  & Revenue</h1>
      </div>
      <div className="profit-chart-wrapper">
        <BarChart
          xAxis={[{ scaleType: 'band', data: months, tickLabelStyle: { fontSize: 12 } }]}
          series={[
            { data: revenue, label: 'Revenue', color: '#2F6BFF', valueFormatter: (v) => numberFmt(v) },
            { data: profit, label: 'Profit', color: '#F1CFAE', valueFormatter: (v) => numberFmt(v) },
          ]}
          height={220}
          grid={{ vertical: false, horizontal: true }}
          margin={{ left: 64, right: 24, top: 16, bottom: 36 }}
          yAxis={[{
            min: 20000,
            max: 80000,
            tickNumber: 4,
            valueFormatter: (v) => numberFmt(v),
            tickLabelStyle: { fontSize: 12 },
          }]}
          slotProps={{
            legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' } },
            tooltip: { trigger: 'item' },
          }}
          highlightScope={{ highlighted: 'series', faded: 'global' }}
          sx={{
            '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': { fill: 'var(--Grey-600)' },
            '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': { fill: 'var(--Grey-600)' },
            '.MuiChartsAxis-line, .MuiChartsAxis-tick': { stroke: '#E5E7EB' },
            '.MuiChartsGrid-horizontal line': { stroke: '#E5E7EB' },
            '.MuiChartsLegend-series > text': { fontSize: 12, fill: 'var(--Grey-700)' },
          }}
        />
      </div>
    </div>
  );
}