
import { useEffect, useState, type ChangeEvent } from "react";


import API from "../../axiosConfig";
import { getTodayDateString } from "../types/DateFormates";


export interface AddExpense {  // To add Expense details
    expenseOn: string;
    description: string;
    amount: number;
    date: string;
    income: number;

};

export interface GetExpensList {  // To get Expense list and Paggination
    id: number;
    date: string;
    expenseOn: string;
    description: string;
    income: number;
    amount: number;
    totalAmount: number;

}

export interface FilterButtons {     // To apply filters using buttons
    page: number,
    limit: number;
    cursor: number | null,
}

export interface ApiResponse {
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

export interface selectedData {
    groupData: string;
};

const useExpenses = () => {


    const [premiumload, setPremiumLoad] = useState<boolean>(false);
    const [premiumMsg, setPremiumMsg] = useState<string>('');
    const [formLoading, setFormLoading] = useState<boolean>(false);

    const [paginatedList, setPaginatedList] = useState<GetExpensList[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [hasPrevious, setHasPrevious] = useState<boolean>(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [expLimit, setExpLimit] = useState<number>(5);




    const [expList, setExpList] = useState<GetExpensList[]>([]);
    const [message, setMessage] = useState<string>('');


    const [filters, setFilters] = useState<FilterButtons>({
        cursor: null,
        limit: Number(expLimit),
        page: 1
    });

    const [expForm, setExpForm] = useState<AddExpense>({
        expenseOn: '',
        description: '',
        amount: 0,
        date: getTodayDateString(),
        income: 0,
    });

    const [applyFilter, setApplyFilter] = useState<selectedData>({
        groupData: ''
    });

    const handleSelectedData = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setApplyFilter((prev) => ({
            ...prev,
            [name]: value
        }))
    }

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

                        console.log("Razorpay Response from gateway:", razorpayResponse);

                        const updateRes = await API.post('/premium/update', {
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature
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
        }
        finally {
            setPremiumLoad(false);
        }
    };




    const fetchExpenses = async (customLimit: number) => {
        setLoading(true);
        try {
            const params: Record<string, string> = {
                page: filters.page.toString(),
                limit: customLimit.toString(),
                groupData: applyFilter.groupData.toString()
            };
            if (filters.cursor !== null && filters.cursor !== undefined) {
                params.cursor = filters.cursor.toString();
            }

            const queryParams = new URLSearchParams(params).toString();

            const response = await API.get<ApiResponse>(`/expenses/allExp?${queryParams}`);

            const result = response.data;
            if (result.success) {

                setPaginatedList(result.expenses);
                setTotalPages(result.totalPages);
                setCurrentPage(result.currentPage);
                setHasNext(result.hasNext);
                setHasPrevious(result.hasPrevious);

                setTotalAmount(result.totalAmount);

                if (Array.isArray(result.expenses)) {
                    setExpList(result.expenses);
                }
            }
        }


        catch (error: any) {
            console.error("Fetch Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Select number of row using DDL
    useEffect(() => {
        if (paginatedList && paginatedList.length > 0) {
            const lastItem = paginatedList[paginatedList.length - 1];
            setTotalAmount(lastItem.totalAmount);
        } else {
            setTotalAmount(0);
        }
    }, [paginatedList, ]);









    const handleFormSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();
        setFormLoading(true);
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
        setFormLoading(false);
        e.target.reset();
    }


    // -------------------------------- download csv file of expenses --------------------------------------

    const downloadCSV = () => {
        const headers = ["S.No.", "Date", "Expense On", "Description", "Income", "Amount", "Total Amount"];

        const rows = expList.map((item, index) => [
            index + 1,
            item.date,
            `"${item.expenseOn.replace(/"/g, '""')}"`,
            `"${item.description.replace(/"/g, '""')}"`,
            item.income,
            item.amount,
            item.totalAmount
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Expenses_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        fetchExpenses(filters.limit);
    }, [filters, ]);


    // -------------------------------- download csv file of expenses --------------------------------------


    return {
        loading,
        expList,
        expForm,
        handleChange,
        handleFormSubmit,
        handlePayment,
        setFilters,
        totalAmount,
        message,
        premiumload,
        premiumMsg,
        paginatedList,
        hasNext,
        currentPage,
        totalPages,
        hasPrevious,
        setTotalAmount,
        formLoading,
        fetchExpenses,
        downloadCSV,
        setExpLimit,
        expLimit,
        handleSelectedData,
        applyFilter,
        filters

    };








}


export default useExpenses;