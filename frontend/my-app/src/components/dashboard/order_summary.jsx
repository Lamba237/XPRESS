import { LineChart } from '@mui/x-charts/LineChart';

export default function OrderSummary() {
  return (
    <div className="chart-container">
        <h1 className="header-1">Order Summary</h1>
        <LineChart
            xAxis={[{ data: [100, 200, 300, 400] }]}
            series={[
                {
                data: [9.5, 6.5, 7.5, 8.5, 7.5, 6.5, 6.3, 8],
                },
                {
                data: [8.5, 7.5, 6.5, 7.5, 6.5, 6.3, 8, 9.5],
                },
            ]}
            width={400}
            height={290}
            
        />
    </div>
  );
}