import React, { useEffect, useMemo, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function OrderSummary() {
  const labels = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], []);
  const series1 = useMemo(() => [9.5, 6.5, 7.5, 8.5, 7.5, 6.5, 6.3, 8], []);
  const series2 = useMemo(() => [8.5, 7.5, 6.5, 7.5, 6.5, 6.3, 8, 9.5], []);

  // Animated series values (ease from 0 to target on mount)
  const [data1, setData1] = useState(series1.map(() => 0));
  const [data2, setData2] = useState(series2.map(() => 0));

  // Show/hide series interactivity
  const [visible, setVisible] = useState({ s1: true, s2: true });

  useEffect(() => {
    let raf;
    const duration = 900; // ms
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      setData1(series1.map((v) => +(v * e).toFixed(2)));
      setData2(series2.map((v) => +(v * e).toFixed(2)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [series1, series2]);

  const plottedSeries = useMemo(() => {
    const list = [];
    if (visible.s1) list.push({ data: data1, label: 'Orders A' });
    if (visible.s2) list.push({ data: data2, label: 'Orders B' });
    return list;
  }, [visible, data1, data2]);

  return (
    <div className="chart-container">
      <h1 className="header-1">Order Summary</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button className="btn" onClick={() => setVisible((v) => ({ ...v, s1: !v.s1 }))}>
          {visible.s1 ? 'Hide' : 'Show'} Series A
        </button>
        <button className="btn" onClick={() => setVisible((v) => ({ ...v, s2: !v.s2 }))}>
          {visible.s2 ? 'Hide' : 'Show'} Series B
        </button>
      </div>

      <BarChart
        xAxis={[{ scaleType: 'band', data: labels }]}
        series={plottedSeries.map((s) => ({
          ...s,
          highlightScope: { faded: 'global', highlighted: 'series' },
        }))}
        width={400}
        height={200}
        slotProps={{ bar: { rx: 4 } }}
        margin={{ top: 16, right: 12, bottom: 24, left: 4 }}
      />
    </div>
  );
}