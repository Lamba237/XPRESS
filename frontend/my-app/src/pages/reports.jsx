import Overview from '../components/reports/overview';
import Best_Selling from '../components/reports/best_selling';
import ProfitChart from '../components/reports/profit_chart';
import Best_Selling_Prod from '../components/reports/best-selling_prod';
import '../styles/reports.css';

export default function Reports() {
    return (
        <div className="report-container">
            <Overview />
            <Best_Selling />
            <ProfitChart />
            <Best_Selling_Prod />
        </div>
    )
}