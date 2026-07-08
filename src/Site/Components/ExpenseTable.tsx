import { Crown, FileDown, Filter, Loader, SquarePen, StepBack, StepForward, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import useExpenses from "../hooks/useExpenses";
import { formatDate } from "../types/DateFormates";
import buttonActionForm from "../hooks/buttonActionForm";
import PopupCards from "./PopupCards";


const ExpenseTable = () => {
    const [submitFormReload, setSubmitFormReload] = useState<boolean>(false);
    const [acitveDelete, setActiveDelete] = useState<number | string | null>(null);

    const { loading,
        handlePayment,
        setFilters,
        message,
        premiumload,
        premiumMsg,
        paginatedList,
        hasNext,
        hasPrevious,
        currentPage,
        totalPages,
        fetchExpenses,
        setExpLimit,
        downloadCSV,
        expLimit,
        filters

    } = useExpenses();

    const { deleteExpense, updateExpense, delLoading } = buttonActionForm(setSubmitFormReload);


    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    // const [expLimit, setExpLimit] = useState<number | null>(null);

    useEffect(() => {
        fetchExpenses(filters.limit);
    }, [filters.limit, filters.page, message, delLoading]);



    return (
        <div className="table-container box">

            <PopupCards
                sortOpen={sortOpen}
                setSortOpen={setSortOpen}
                updateOpen={updateOpen}
                setUpdateOpen={setUpdateOpen}
            />

            <div className="action-btn ">

                <button onClick={handlePayment} className="gold-btn">
                    {premiumload ? (<Loader />) : (<span><Crown size={16} /> . Buy Premium</span>)}
                </button>
                <span>{premiumMsg}</span>



                <button className="btn btn--secondry" onClick={downloadCSV}>Download _<FileDown size={16} />  </button>
            </div>


            <div className="main-exp-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Date</th>
                            <th>Expense</th>
                            <th>Description</th>
                            <th>Income</th>
                            <th>Amount</th>
                            <th>Total</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody id="table-items">
                        {loading ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>
                                    <Loader className="animate-spin" style={{ display: 'inline-block' }} /> <span>Loading Data...</span>
                                </td>
                            </tr>
                        ) : paginatedList && paginatedList.length === 0 ? ( // CHANGED TO paginatedList
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center' }}>
                                    <p>No Items Found</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedList.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>{index + 1 + (currentPage - 1) * filters.limit}</td>
                                    <td>{formatDate(item.date)}</td>
                                    <td>{item.expenseOn}</td>
                                    <td>{item.description}</td>
                                    <td style={{ color: item.income > 0 ? 'green' : 'inherit' }}>{item.income}</td>
                                    <td style={{ color: item.amount > 0 ? 'red' : 'inherit' }}>{item.amount}</td>
                                    <td><strong>{item.totalAmount}</strong></td>
                                    <td className="action-cell" onClick={() => setUpdateOpen(!updateOpen)}><SquarePen color="orange" size={20} /></td>
                                    <td className="action-cell">
                                        {delLoading && acitveDelete === item.id ?
                                            (
                                                <Loader />
                                            ) : (
                                                <button className="delete-btn transparent-btn" onClick=
                                                    {
                                                        async () => {
                                                            setActiveDelete(item.id);
                                                            await deleteExpense(item.id)
                                                            setActiveDelete(null);
                                                        }
                                                    }>
                                                    <Trash2 color="red" size={20} />
                                                </button>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))

                        )}
                    </tbody>
                </table>

                {/* ---------------------- current Page / Total Page ---------------------- */}

                <div className="paggination" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>

                    <button
                        className="pagging-btn"
                        disabled={!hasPrevious}
                        onClick={() => setFilters(p => ({
                            ...p,
                            page: p.page - 1,
                            cursor: null
                        }))}
                    >
                        <StepBack />
                    </button>

                    <select 
                        name="expLimit" 
                        id="expLimit" 
                        className="btn btn--secondry" 
                        value={filters.limit} 
                        onChange={(e) => {
                            const newLimit = Number(e.target.value);
                            setFilters(p => ({
                                ...p,
                                limit: newLimit,
                                page: 1 
                            }));
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>


                <span>page: {currentPage || 1}/{totalPages || 1}</span>


                <button
                    className="pagging-btn"
                    disabled={!hasNext}
                    onClick={() => setFilters(p => ({
                        limit: p.limit,
                        page: p.page + 1,
                        cursor: null
                    }))}
                >
                    <StepForward />

                </button>

            </div>


            {/* ---------------------- current Page / Total Page ---------------------- */}


        </div>
        </div >
    );
}


export default ExpenseTable;