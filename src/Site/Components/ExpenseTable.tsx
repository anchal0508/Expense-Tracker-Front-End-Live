import { Crown, FileDown, Loader, SquarePen, StepBack, StepForward, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../types/DateFormates";
import { useExpenses } from "../hooks/useExpenses";
import PopupCards from "./PopupCards";

const ExpenseTable = () => {
    const {
        expenses,
        loading,
        groupData,
        limit,
        totalPages,
        currentPage,
        setLimit,
        setPage,
        downloadCSV,
        setIsPremiumModalOpen,
        premiumLoad,
        premiumMsg,
        deleteExpense,
        setEditingExpense

    } = useExpenses();

    const [updateOpen, setUpdateOpen] = useState<boolean>(false);
    const [updateLoad, setUpdateLoad] = useState<boolean>(false);
    const [delLoading, setDelLoading] = useState<boolean>(false);
    const [acitveDelete, setActiveDelete] = useState<number | string | null>(null);

    const deleting = async (id: any) => {
        setDelLoading(true);
        try {
            await deleteExpense(id);
            console.log("Deleting id:", id);
        } catch (error) {
            console.error("Delete handler error: ", error);
        } finally {
            setDelLoading(false);
        }
    };

     
    return (
        <div className="table-container box">
            <PopupCards updateOpen={updateOpen} setUpdateOpen={setUpdateOpen} />

            <div className="action-btn">
                <button
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="gold-btn"
                    disabled={premiumLoad}
                >
                    {premiumLoad ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <span><Crown size={16} /> . Buy Premium</span>
                    )}
                </button>

                {premiumMsg && (
                    <span style={{ marginLeft: "10px", color: "gold", fontSize: "14px" }}>
                        {premiumMsg}
                    </span>
                )}

                <button
                    className="btn btn--secondry"
                    onClick={async () => {
                        if (expenses.length === 0) {
                            alert("Download karne ke liye koi data nahi hai!");
                            return;
                        }
                        await downloadCSV();
                    }}
                    disabled={loading}
                >
                    Download _<FileDown size={16} />
                </button>
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
                            {groupData === 'all' && <th>Edit</th>}
                            {groupData === 'all' && <th>Delete</th>}
                        </tr>
                    </thead>
                    <tbody id="table-items">
                        {loading ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center' }}>
                                    <Loader className="animate-spin" style={{ display: 'inline-block' }} /> <span>Loading Data...</span>
                                </td>
                            </tr>
                        ) : expenses && expenses.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center' }}>
                                    <p>No Items Found</p>
                                </td>
                            </tr>
                        ) : (
                            expenses.map((item, index) => (
                                <tr key={item.id || `grouped-row-${item.date}-${index}`}>
                                    <td>{index + 1 + (currentPage - 1) * limit}</td>

                                    <td>
                                        {groupData === 'monthly'
                                            ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : groupData === 'yearly'
                                                ? new Date(item.date).getFullYear()
                                                : formatDate(item.date)
                                        }
                                    </td>
                                    <td>{item.expenseOn}</td>
                                    <td>{item.description}</td>
                                    <td style={{ color: item.income > 0 ? 'green' : 'inherit' }}>{item.income}</td>
                                    <td style={{ color: item.amount > 0 ? 'red' : 'inherit' }}>{item.amount}</td>
                                    <td><strong>{item.totalAmount !== undefined ? item.totalAmount : 'N/A'}</strong></td>

                                    {groupData === 'all' && (
                                        <td className="action-cell" onClick={async () => {
                                            setUpdateOpen(true);
                                            setEditingExpense(item);
                                        }}
                                            style={{ cursor: "pointer" }}>

                                            <SquarePen color="orange" size={20} />

                                        </td>
                                    )}

                                    {groupData === 'all' && (
                                        <td className="action-cell">
                                            {delLoading && acitveDelete === item.id ? (
                                                <Loader className="animate-spin" />
                                            ) : (
                                                <button className="delete-btn transparent-btn" onClick={async () => {
                                                    setActiveDelete(item.id || null);
                                                    await deleting(item.id);
                                                    setActiveDelete(null);
                                                }}>
                                                    <Trash2 color="red" size={20} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination segments */}
                <div className="paggination" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                    <button
                        className="pagging-btn"
                        disabled={currentPage <= 1 || loading}
                        onClick={() => setPage(currentPage - 1)}
                    >
                        <StepBack />
                    </button>

                    <select
                        name="expLimit"
                        id="expLimit"
                        className="btn btn--secondry"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                        }}
                    >
                        <option value="5">5 Rows</option>
                        <option value="10">10 Rows</option>
                        <option value="15">15 Rows</option>
                    </select>

                    <span>page: {currentPage || 1}/{totalPages || 1}</span>

                    <button
                        className="pagging-btn"
                        disabled={currentPage >= totalPages || loading}
                        onClick={() => setPage(currentPage + 1)}
                    >
                        <StepForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTable;
