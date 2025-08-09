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
            sx={{
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #e0e0e0',
                boxShadow: '3px 2px 8px rgba(0,0,0,0.1)'
            }}
        />
    </div>
  );
}