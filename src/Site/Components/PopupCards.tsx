import { Loader, Search, SquareX } from "lucide-react";
import React from "react";
import useExpenses from "../hooks/useExpenses";

interface PopupCardProps {
    sortOpen: boolean;
    setSortOpen: React.Dispatch<React.SetStateAction<boolean>>;
    updateOpen: boolean;
    setUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PopupCards: React.FC<PopupCardProps> = ({
    sortOpen,
    setSortOpen,
    updateOpen,
    setUpdateOpen,
}) => {
    
    
    
    
    const {
        formLoading,
        applyFilter,
        expForm,
        handleChange,
        handleSelectedData,
        fetchExpenses,
        message,
    } = useExpenses();




    return (
        <>

            <div className={`s-card ${updateOpen ? 's-card--update-open' : 's-card--update-closed'}`}>

                <span onClick={() => setUpdateOpen(!updateOpen)}><SquareX size={25} /></span>
                <div className="update-card">
                    <form className="update-form">
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
                        <button className="btn btn--secondry">
                            {formLoading ? (<Loader />) : (<>Submit</>)}
                        </button>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                    </form>
                </div>
            </div>

            <h2 className="card-header">Your Expenses</h2>

            <div className="filter-section" >

                <select name="groupData" id="groupData" className="btn btn--secondry" value={applyFilter.groupData} onChange={(e: any)=>{handleSelectedData(e); fetchExpenses(5)}}>
                    <option value="all"  >All</option>
                    <option value="daily"  >Daily</option>
                    <option value="monthly" >Monthly</option>
                    <option value="yearly"  >Yearly</option>
                </select>

               
                <div className="search-block">
                    <input type="search" name="search" id="search" placeholder="    : Type your Expense Catagory" />
                    <Search size={18} />
                </div>
            </div>

        </>
    )

}


export default PopupCards;