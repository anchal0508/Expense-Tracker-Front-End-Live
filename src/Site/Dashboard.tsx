import React from 'react';
import { useExpenses } from './hooks/useExpenses'; // Apne system setup ke hisab se relative path check karein
import ExpenseForm from "./Components/ExpenseForm";
import ExpenseTable from "./Components/ExpenseTable";
import SummaryCards from './Components/SummaryCards';
import TodaysTable from "./Components/TodaysTable";
import PremiumModal from "./Components/PremiumModal"; // 👈 Context connected global modal file component

const Dashboard: React.FC = () => {
    // 💎 Context Cloud Memory se safe direct pointers destructured kiye layout parameters ke liye
    const { totalAmount } = useExpenses();

    return (
        <div className="dashboard-page">
            <h1 className="heading">Expenses-555</h1>
            
            {/* 👑 Zero-props standard placeholder layout trigger pop-up block */}
            <PremiumModal />

            <div className="bento-grid">
                {/* 1. Add Expenses Form Box Connected */}
                <ExpenseForm />

                {/* 2. Total Balance Sidebar Box Display Panel (Now Fully Dynamic!) 💰 */}
                <div className="side-box box">
                    <h3>Total Balance--</h3>
                    {/* Database summary response context tracking state pointer value linked */}
                    <p>Rs. {totalAmount !== undefined ? totalAmount : 0}</p>
                </div>

                {/* 3. Central Connected Grid Data Table Module */}
                <ExpenseTable />

                {/* 4. Secondary complementary analytics grid elements cards panels */}
                <TodaysTable />
                <SummaryCards />
            </div>
        </div>
    );
};

export default Dashboard;
