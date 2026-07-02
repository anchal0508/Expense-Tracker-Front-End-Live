import { Crown, Loader, PanelLeftClose, Search, StepBack, StepForward } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import API from "../axiosConfig";
import { getTodayDateString, formatDate, getTodayFormatted } from './types/DateFormates';


interface AddExpense {  // To add Expense details
    expenseOn: string;
    description: string;
    amount: number;
    date: string;
    income: number;

};

interface GetExpensList {  // To get Expense list and Paggination
    id: number;
    date: string;
    expenseOn: string;
    description: string;
    income: number;
    amount: number;
    totalAmount: number;

}

interface FilterButtons {     // To apply filters using buttons
    page: number,
    limit: number;
    cursor: number | null,
}

interface ApiResponse {
    success: boolean;
    expenses: GetExpensList[];
    nextCursor: number | string;
    hasMore: boolean;
    totalAmount: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
}


const Dashboard: React.FC = () => {

    const [premiumload, setPremiumLoad] = useState<boolean>(false);
    const [premiumMsg, setPremiumMsg] = useState<string>('');

    const [hasNext, setHasNext] = useState<boolean>(true);
    const [hasPrevious, setHasPrevious] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);


    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedList, setPaginatedList] = useState<GetExpensList[]>([]);

    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [updateOpen, setupdateOpen] = useState<boolean>(false);

    const [expList, setExpList] = useState<GetExpensList[]>([]);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [expForm, setExpForm] = useState<AddExpense>({
        expenseOn: '',
        description: '',
        amount: 0,
        date: getTodayDateString(),
        income: 0,
    });

    const [filters, setFilters] = useState<FilterButtons>({
        cursor: null,
        limit: 5,
        page: 1
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExpForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handlePayment = async () => {
        setPremiumLoad(true);
        setPremiumMsg('');

        try {
            const response = await API.get('/premium/gold');

            console.log("Full Backend Response:", response);

            if (!response || !response.data) {
                throw new Error("No data received from backend server");
            }

            const { order, key_id } = response.data;

            if (!order || !key_id) {
                throw new Error(`Missing order or key_id from server. Order: ${order}, Key: ${key_id}`);
            }

            const options = {
                key: key_id,
                order_id: order.id,
                name: "ABCROB Nexus",
                description: "Buy Premium Membership",
                handler: async function (razorpayResponse: any) {
                    try {
                        setPremiumLoad(true);

                        // Debugging ke liye check karein ki Razorpay kya de raha hai
                        console.log("Razorpay Response from gateway:", razorpayResponse);

                        // FIXED: Teeno parameters ko sahi namon se backend ko bhejein
                        const updateRes = await API.post('/premium/update', { // URL path check kar lein, relative path '../' ki jagah absolute '/' sahi rehta hai
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature // Ye sabse zaroori tha!
                        });

                        setPremiumMsg(updateRes.data.message || "Premium activated successfully!");
                    } catch (err: any) {
                        console.error("Backend update error details:", err);
                        setPremiumMsg(err.response?.data?.message || "Failed to update payment status.");
                    } finally {
                        setPremiumLoad(false);
                    }
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: function () {
                        setPremiumLoad(false);
                        setPremiumMsg("Payment cancelled by user.");
                    }
                }
            };

            if (typeof (window as any).Razorpay === 'undefined') {
                throw new Error("Razorpay SDK not loaded. Did you forget to add the script tag in index.html?");
            }

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error("Exact FrontEnd Error Catch:", error);
            setPremiumMsg(error.message || error.response?.data?.message || "Something went wrong while creating order.");
            setPremiumLoad(false);
        }
    };


    useEffect(() => {
        if (paginatedList && paginatedList.length > 0) {
            const lastItem = paginatedList[paginatedList.length - 1];
            setTotalAmount(lastItem.totalAmount);
        } else {
            setTotalAmount(0);
        }
    }, [paginatedList]);


    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {
                page: filters.page.toString(),
                limit: filters.limit.toString(),
            };
            if (filters.cursor !== null && filters.cursor !== undefined) {
                params.cursor = filters.cursor.toString();
            }

            const queryParams = new URLSearchParams(params).toString();

            const response = await API.get<ApiResponse>(`/expenses/allExp?${queryParams}`);
            console.log("----------------->>>>>>-----------", queryParams);

            const result = response.data;
            if (result.success) {

                setPaginatedList(result.expenses);
                setTotalPages(result.totalPages);
                setCurrentPage(result.currentPage);
                setHasNext(result.hasNext);
                setHasPrevious(result.hasPrevious);

                setTotalAmount(result.totalAmount);
            }
        }


        catch (error: any) {
            console.error("Fetch Error:", error.message);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {

        const getExpenseDetails = async () => {

            try {
                const response = await API.get('/expenses/allExp');
                if (response.status === 200) {
                    const serverData = response.data.expenses;

                    if (Array.isArray(serverData)) {
                        setExpList(serverData);
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.data)
                    setMessage(error.response?.data?.message || 'unable to get Expense details');
            }
        }
        getExpenseDetails();

    }, [filters])





    useEffect(() => {
        fetchExpenses();
    }, [filters]);



    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const newExp = {
            expenseOn: expForm.expenseOn,
            description: expForm.description,
            amount: expForm.amount,
            date: expForm.date,
            income: expForm.income,
        }

        try {
            const response = await API.post('/expenses/addExp', newExp);
            if (response.status === 201) {
                setMessage(response.data.message || 'Local: Expense added Successfully...!');
                setExpForm({
                    expenseOn: '',
                    description: '',
                    amount: 0,
                    date: getTodayDateString(), // Automatically resets to today's date picker layout
                    income: 0,
                });
            }
        } catch (error: any) {
            setMessage(error.message);

        }
        setLoading(false);
        e.target.reset();
    }


    return (
        <div className="dashboard-page">
            <div className={`s-card ${sortOpen ? 's-card--sort-open' : 's-card--sort-closed'}`} >
                <span onClick={() => setSortOpen(!sortOpen)}><PanelLeftClose size={25} /></span>
                <h1>Sorting</h1>
            </div>
            <div className={`s-card ${filterOpen ? 's-card--filter-open' : 's-card--filter-closed'}`}>
                <span onClick={() => setFilterOpen(!filterOpen)}><PanelLeftClose size={25} /></span>
                <h1>Filter</h1>
            </div>
            <div className={`s-card ${updateOpen ? 's-card--update-open' : 's-card--update-closed'}`}>
                <span onClick={() => setupdateOpen(!updateOpen)}><PanelLeftClose size={25} /></span>
                <h1>Update</h1>
            </div>

            <h1 className="heading">Expenses-555</h1>
            <div className="bento-grid">
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
                        <button className="btn btn--primary">
                            {loading ? (<Loader />) : (<span>Submit</span>)}
                        </button>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                    </form>
                </div>
                <div className="side-box box"><h3>Total Balance</h3><p>Rs.:
                    {
                        totalAmount
                    }
                </p></div>


                <div className="table-container box">

                    <h2 className="card-header">Your Expenses</h2>

                    <div className="filter-section" >
                        <button className="btn btn--secondry" onClick={() => setFilterOpen(true)}>Filter</button>
                        <button className="btn btn--secondry" onClick={() => setSortOpen(true)}>sort</button>
                        <select name="timeFrame" id="timeFrame" className="btn btn--secondry">
                            <option value="daily" selected >Daily</option>
                            <option value="monthly" >Monthly</option>
                            <option value="yearly"  >Yearly</option>
                        </select>
                        <div className="search-block">
                            <input type="search" name="search" id="search" placeholder="    : Type your Expense Catagory" />
                            <Search size={18} />
                            {/* <button className="btn btn--secondry">Search</button> */}
                        </div>
                    </div>


                    <div className="action-btn ">
                        <button onClick={handlePayment} className="gold-btn">
                            {premiumload ? (<Loader />) : (<span><Crown size={16} /> . Data Analysis</span>)}


                        </button><span>{premiumMsg}</span>
                        <button className="btn btn--primary" onClick={() => setupdateOpen(true)}>Update</button>
                        <button className="btn btn--primary">Delete</button>
                        <button className="btn btn--secondry"><Crown size={16} />  .View Full Screen</button>
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
                                    paginatedList.map((item, index) => ( // CHANGED TO paginatedList
                                        <tr key={item.id || index}>
                                            <td>{item.id}</td>
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.expenseOn}</td>
                                            <td>{item.description}</td>
                                            <td style={{ color: item.income > 0 ? 'green' : 'inherit' }}>{item.income}</td>
                                            <td style={{ color: item.amount > 0 ? 'red' : 'inherit' }}>{item.amount}</td>
                                            <td><strong>{item.totalAmount}</strong></td>

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


                            <span>page: {currentPage || 1}/{totalPages || 1}</span>


                            <button
                                className="pagging-btn"
                                disabled={!hasNext}
                                onClick={() => setFilters(p => ({
                                    ...p,
                                    page: p.page + 1,
                                    cursor: null
                                }))}
                            >
                                <StepForward />

                            </button>

                        </div>


                        {/* ---------------------- current Page / Total Page ---------------------- */}


                    </div>
                </div>
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

                                const todayExpenses = expList ? expList.filter((item: any) => {
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
                                        <td>{item.expOn || item.expenseOn}</td>
                                        <td>₹{item.amound || item.amount}</td>
                                    </tr>
                                ));
                            })()}


                        </tbody>
                    </table>
                </div>
                <div className="side-box box"><h3>Monthly Income</h3><p>Rs.: </p></div>
                <div className="side-box box"><Crown className="premium-icon" size={16} /> <h3>Graph</h3></div>


                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Previous Month</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Last Year</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Upcomming</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>OverAll</h3><p>Rs.: </p></div>
                <div className="bt-card box"><Crown className="premium-icon" size={16} /> <h3>Money Saved in %</h3><p>Avg.: </p></div>



            </div>
        </div >
    )
}

export default Dashboard;