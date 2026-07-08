import { Loader } from "lucide-react";
import useExpenses from "../hooks/useExpenses";
import { useEffect } from "react";


const ExpenseForm = () => {
    const {
        formLoading,
        expForm,
        handleChange,
        handleFormSubmit,
        message,
        expLimit,
        fetchExpenses,
        

    } = useExpenses();
    useEffect(() => {
        fetchExpenses(expLimit)
    }, [formLoading])


    return (
        <div className="form box">
            <form className="exp-form" onSubmit={handleFormSubmit}>
                <h2 className="card-header">Add Expenses</h2>
                <div className="input-fields">
                    <div className="form-group">
                        <label htmlFor="expenseOn">Expense On</label>
                        <input
                            type="text"
                            name="expenseOn"
                            id="expenseOn"
                            required
                            value={expForm.expenseOn}
                            onChange={handleChange}
                            placeholder="    : Your expense"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            onChange={handleChange}
                            value={expForm.description}
                            required
                            placeholder="    : Details of your Expense"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount: Rs/-</label>
                        <input
                            type="text"
                            name="amount"
                            id="amount"
                            onChange={handleChange}
                            value={expForm.amount}
                            required
                            placeholder="    : Total-Amount"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            onChange={handleChange}
                            value={expForm.date}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="income">Income</label>
                        <input
                            type="text"
                            name="income"
                            id="income"
                            onChange={handleChange}
                            value={expForm.income}
                            required
                        />
                    </div>
                </div>
                <button className="btn btn--primary" onClick={() => { fetchExpenses(expLimit) }}>
                    {formLoading ? (<Loader />) : (<span>Submit</span>)}
                </button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
            </form>
        </div>
    );
}


export default ExpenseForm;