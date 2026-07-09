import { Loader } from "lucide-react";
import { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";


const ExpenseForm = () => {
 const { addExpense, loading: formLoading } = useExpenses();

    const [formMessage, setFormMessage] = useState<string>("");

    const [expForm, setExpForm] = useState({
        expenseOn: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0], 
        income: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExpForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormMessage("");

        const success = await addExpense({
            expenseOn: expForm.expenseOn,
            description: expForm.description,
            amount: Number(expForm.amount) || 0,
            date: expForm.date,
            income: Number(expForm.income) || 0
        });

        if (success) {
            setFormMessage("Expense added Successfully...!");
            setExpForm({
                expenseOn: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                income: ''
            });
        } else {
            setFormMessage("Failed to add transaction. Try again.");
        }
    };


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
                            placeholder="    : Default will be 0"
                            defaultValue={0}
                            
                        />
                    </div>
                </div>

                <button className="btn btn--primary" type="submit" disabled={formLoading}>
                    {formLoading ? (<Loader className="animate-spin" />) : (<span>Submit</span>)}
                </button>
                {formMessage && <p style={{ color: 'green', marginTop: '10px' }}>{formMessage}</p>}
            </form>
        </div>
    );
}

export default ExpenseForm;
