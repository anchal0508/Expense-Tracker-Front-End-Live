import React, { useEffect, useState } from "react";
import { Loader, Search, SquareX } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";

interface PopupCardsProps {
    updateOpen: boolean;
    setUpdateOpen: (val: boolean) => void;
}

const PopupCards: React.FC<PopupCardsProps> = ({ updateOpen, setUpdateOpen }) => {
    const {
        groupData,
        setGroupData,
        searchQuery,
        setSearchQuery,
        setPage,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        editingExpense,
        setEditingExpense,
        updateExpense

    } = useExpenses();

     const [formLoading, setFormLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const [expForm, setExpForm] = useState({
        expenseOn: '',
        description: '',
        amount: 0,
        date: '',
        income: 0
    });

    useEffect(() => {
        if (editingExpense) {
            setExpForm({
                expenseOn: editingExpense.expenseOn || '',
                description: editingExpense.description || '',
                amount: editingExpense.amount || 0,
                date: editingExpense.date ? editingExpense.date.substring(0, 10) : '',
                income: editingExpense.income || 0
            });
        }
    }, [editingExpense]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExpForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectedData = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGroupData(e.target.value);
        setPage(1);
    };

    const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingExpense?.id) return;

        setFormLoading(true);
        setMessage("");

        // Triggering update process endpoint pipeline
        const success = await updateExpense(editingExpense.id, {
            expenseOn: expForm.expenseOn,
            description: expForm.description,
            amount: Number(expForm.amount) || 0,
            date: expForm.date,
            income: Number(expForm.income) || 0
        });

        if (success) {
            setMessage("Expense updated successfully!");
            setEditingExpense(null); 
            setTimeout(() => {
                setUpdateOpen(false);
                setMessage("");
            }, 1000); 
        } else {
            setMessage("Failed to update execution parameters.");
        }
        setFormLoading(false);
    };

    return (
        <>
            {/* Edit Expense Sliding Drawer Component */}
            <div className={`s-card ${updateOpen ? 's-card--update-open' : 's-card--update-closed'}`}>
                <span onClick={() => setUpdateOpen(!updateOpen)} style={{ cursor: 'pointer' }}>
                    <SquareX size={25} />
                </span>

                <div className="update-card">
                    <form className="update-form" onSubmit={handleFormSubmit}>
                        <h2 className="card-header">Edit Expense</h2>
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
                                    type="number"
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
                                    type="number"
                                    name="income"
                                    id="income"
                                    onChange={handleChange}
                                    value={expForm.income}
                                    required
                                />
                            </div>
                        </div>
                        <button className="btn btn--secondry" type="submit">
                            {formLoading ? (<Loader className="animate-spin" />) : (<>Submit</>)}
                        </button>
                        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
                    </form>
                </div>
            </div>

            <h2 className="card-header">Your Expenses</h2>

            {/* Combined Filters Panel Section */}
            <div className="filter-section" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/*  Grouped Data Dropdown Selector */}
                    <select
                        name="groupData"
                        id="groupData"
                        className="btn btn--secondry"
                        value={groupData}
                        onChange={handleSelectedData}
                    >
                        <option value="all">All</option>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    {/* Live Date Range Filter Layer Elements (Only active in "all" view) */}
                    <div className="date-range-block" style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: groupData === 'all' ? 1 : 0.5 }}>
                        <input
                            type="date"
                            className="btn btn--secondry"
                            value={startDate}
                            disabled={groupData !== 'all'}
                            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                        />
                        <span style={{ fontSize: '14px', color: 'gray' }}>To</span>
                        <input
                            type="date"
                            className="btn btn--secondry"
                            value={endDate}
                            disabled={groupData !== 'all'}
                            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                        />
                        {/* Option to quickly reset active date boundaries filter blocks */}
                        {(startDate || endDate) && (
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '12px' }}
                                onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}
                            >
                                Clear Dates
                            </button>
                        )}
                    </div>
                </div>

                <div className="search-block" style={{ opacity: groupData === 'all' ? 1 : 0.5 }}>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={groupData !== 'all'}
                        placeholder={groupData === 'all' ? "    : Type your Expense Category" : "    : Search disabled in grouped view"}
                    />
                    <Search size={18} />
                </div>
            </div>
        </>
    );
};

export default PopupCards;
