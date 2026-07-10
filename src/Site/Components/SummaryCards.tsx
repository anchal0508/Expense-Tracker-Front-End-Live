import { Crown } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { useAuth } from "../../AuthContext";


const SummaryCards = () => {
    const { expenses } = useExpenses();
    const {user} = useAuth();

    const calculateAnalytics = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-11 index format

        let totalMonthlyIncome = 0;
        let totalMonthlyExpense = 0;
        let totalOverallIncome = 0;
        let totalOverallExpense = 0;
        let previousMonthTotal = 0;
        let lastYearTotal = 0;

        if (expenses && Array.isArray(expenses)) {
            expenses.forEach((item: any) => {
                const itemDate = new Date(item.date);
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth();
                const incomeAmt = Number(item.income) || 0;
                const expenseAmt = Number(item.amount) || 0;

                totalOverallIncome += incomeAmt;
                totalOverallExpense += expenseAmt;

                if (itemYear === currentYear && itemMonth === currentMonth) {
                    totalMonthlyIncome += incomeAmt;
                    totalMonthlyExpense += expenseAmt;
                }

                const prevMonthCheck = currentMonth === 0 ? 11 : currentMonth - 1;
                const prevYearCheck = currentMonth === 0 ? currentYear - 1 : currentYear;
                if (itemYear === prevYearCheck && itemMonth === prevMonthCheck) {
                    previousMonthTotal += expenseAmt;
                }

                if (itemYear === currentYear - 1) {
                    lastYearTotal += expenseAmt;
                }
            });
        }

        const overallSavings = totalOverallIncome - totalOverallExpense;
        const savingsPercentage = totalOverallIncome > 0
            ? Math.round((overallSavings / totalOverallIncome) * 100)
            : 0;

        return {
            monthlyIncome: totalMonthlyIncome,
            previousMonthExpense: previousMonthTotal,
            lastYearExpense: lastYearTotal,
            overallBalance: overallSavings,
            savingsPct: savingsPercentage
        };
    };

    const analytics = calculateAnalytics();

    
    return (
        <>
            <div className="side-box box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Monthly Income</h3>
                {(user?.isPremium ) && <p style={{ color: 'green', fontWeight: 'bold' }}>Rs.: {analytics.monthlyIncome}</p>}
                
            </div>

            <div className="side-box box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}

                <h3>Graph</h3>
                <img src="https://www.google.com/imgres?q=graph%20png%20image&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F020%2F953%2F642%2Fsmall%2Fbusiness-chart-with-arrow-free-png.png&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-png%2Fgrowth-chart&docid=dRB-Owc0NzM6LM&tbnid=yFLex9-uDaDFmM&vet=12ahUKEwi3-P7mh8iVAxVxbmwGHQ-IGaEQnPAOegQIQhAA..i&w=350&h=350&hcb=2&ved=2ahUKEwi3-P7mh8iVAxVxbmwGHQ-IGaEQnPAOegQIQhAA" alt="Graph" />
            </div>

            <div className="bt-card box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Previous Month</h3>
                {(user?.isPremium ) && <p>Rs.: {analytics.previousMonthExpense}</p>}
            </div>

            <div className="bt-card box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Last Year</h3>
                {(user?.isPremium ) && <p>Rs.: {analytics.lastYearExpense}</p>}
            </div>

            <div className="bt-card box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Upcoming</h3>
              {(user?.isPremium ) &&   <p>Rs.: 0</p>}
            </div>

            <div className="bt-card box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Overall Savings</h3>
               {(user?.isPremium ) &&  <p style={{ color: analytics.overallBalance >= 0 ? 'green' : 'red' }}>
                    Rs.: {analytics.overallBalance}
                </p>}
            </div>

            <div className="bt-card box">
                {!(user?.isPremium ) && <Crown className="premium-icon" size={16} />}
                <h3>Money Saved in %</h3>
              {(user?.isPremium ) &&   <p style={{ color: analytics.savingsPct >= 0 ? 'green' : 'red' }}>
                    Avg.: {analytics.savingsPct}%
                </p>}
            </div>
        </>
    );
};

export default SummaryCards;
