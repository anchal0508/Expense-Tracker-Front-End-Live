import useExpenses from './hooks/useExpenses';
import ExpenseForm from "./Components/ExpenseForm";
import ExpenseTable from "./Components/ExpenseTable";
import SummaryCards from './Components/SummaryCards';
import TodaysTable from './Components/TodaysTable';


const Dashboard: React.FC = () => {

    const {
        totalAmount,
    } = useExpenses();





    return (
        <div className="dashboard-page">


            <h1 className="heading">Expenses-555</h1>
            <div className="bento-grid">

                <ExpenseForm />


                <div className="side-box box">
                    <h3>Total Balance--</h3>
                    <p>Rs.:{totalAmount}i</p>
                </div>


                <ExpenseTable />

                <TodaysTable />


                <SummaryCards />


            </div>
        </div >
    )
}

export default Dashboard;