import { formatDate, getTodayFormatted } from "../types/DateFormates";
import { useExpenses } from "../hooks/useExpenses";

const TodaysTable = () => {
    const { expenses } = useExpenses();


    return (
        <div className="side-box today-exp box">
            <h3>Todays Expenses</h3>
            <table className="side-table-exp">
                <thead>
                    <tr>
                        <th>Expense</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const todayStr = getTodayFormatted();

                        const todayExpenses = expenses ? expenses.filter((item: any) => {
                            return formatDate(item.date) === todayStr;
                        }) : [];

                        if (todayExpenses.length === 0) {
                            return (
                                <tr>
                                    <td colSpan={2} style={{ textAlign: 'center', color: 'gray' }}>
                                        No expenses today
                                    </td>
                                </tr>
                            );
                        }

                        return todayExpenses.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>{item.expenseOn || item.expOn}</td>
                                <td style={{ color: 'red' }}>₹{item.amount || item.amound}</td>
                            </tr>
                        ));
                    })()}
                </tbody>
            </table>
        </div>
    );
};

export default TodaysTable;
