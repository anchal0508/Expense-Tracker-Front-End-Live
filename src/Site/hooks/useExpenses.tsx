import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../../axiosConfig';
import { useAuth } from '../../AuthContext';

export interface ExpenseItem {
    id?: number;
    date: string;
    expenseOn: string;
    description: string;
    income: number;
    amount: number;
    totalAmount?: number;
}

interface ExpenseContextType {
    expenses: ExpenseItem[];
    loading: boolean;
    delLoading: boolean;
    groupData: string;
    limit: number;
    page: number;
    totalPages: number;
    totalAmount: number;
    currentPage: number;
    searchQuery: string;
    startDate: string;
    endDate: string;
    setStartDate: (val: string) => void;
    setEndDate: (val: string) => void;

    setGroupData: (val: string) => void;
    setLimit: (val: number) => void;
    setPage: (val: number) => void;
    setSearchQuery: (val: string) => void;
    fetchExpenses: () => Promise<void>;
    addExpense: (formData: any) => Promise<boolean>;
    downloadCSV: () => Promise<void>;
    deleteExpense: (expenseId: any) => void;
    editingExpense: ExpenseItem | null;
    setEditingExpense: React.Dispatch<React.SetStateAction<ExpenseItem | null>>;
    updateExpense: (id: number, updateData: any) => Promise<boolean>;

    isPremiumModalOpen: boolean;
    setIsPremiumModalOpen: (val: boolean) => void;
    isPremiumUser: boolean;
    setIsPremiumUser: React.Dispatch<React.SetStateAction<boolean>>;
    premiumLoad: boolean;
    premiumMsg: string;
    handlePayment: () => Promise<void>;
    setPremiumLoad: React.Dispatch<React.SetStateAction<boolean>>;
    setPremiumMsg: React.Dispatch<React.SetStateAction<string>>;
}

interface ExpenseProviderProps {
    children: React.ReactNode;

}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {

    const { user } = useAuth();
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [groupData, setGroupData] = useState<string>('all');
    const [limit, setLimit] = useState<number>(5);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
    const [premiumLoad, setPremiumLoad] = useState<boolean>(false);
    const [premiumMsg, setPremiumMsg] = useState<string>("");
    const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

    const [totalAmount, setTotalAmount] = useState<number>(0);


    const [delLoading, setDelLoading] = useState<boolean>(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

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
                        const updateRes = await API.post('/premium/update', {
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature
                        });

                        if (updateRes.data.success) {
                            setPremiumMsg(updateRes.data.message || "Premium activated successfully!");
                            setIsPremiumUser(true);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }
                    } catch (err: any) {
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


    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {
                page: page.toString(),
                limit: limit.toString(),
                groupData: groupData
            };

            if (groupData === 'all' && searchQuery.trim() !== '') {
                params.search = searchQuery;
            }

            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const queryParams = new URLSearchParams(params).toString();
            const response = await API.get(`/expenses/allExp?${queryParams}`);

            if (response.data?.success) {
                setExpenses(response.data.expenses);
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(response.data.currentPage || 1);
                setTotalAmount(response.data.totalAmount || 0);
            }
        } catch (error: any) {
            console.error("Fetching expenses failed:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (formData: any) => {
        try {
            const response = await API.post('/expenses/addExp', formData);
            if (response.status === 201) {
                setGroupData('all');
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
                setPage(1);
                await fetchExpenses();
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Adding expense failed:", error.message);
            return false;
        }
    };

    const deleteExpense = async (expenseId: any) => {
        setDelLoading(true);
        try {
            const response = await API.delete(`/expenses/delete/${expenseId}`);
            console.log('expense deleted: ', response);
            return response;
        } catch (error: any) {
            console.error("Error inside hook while deleting expense:", error.message);
        } finally {
            setDelLoading(false);
        }
    }

    const updateExpense = async (id: number, updatedData: any) => {
        try {
            const response = await API.put(`/expenses/update/${id}`, updatedData); // Backend update API route context linked
            if (response.status === 200 || response.data?.success) {
                await fetchExpenses(); // Edit hote hi main data list refresh karein ✨
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Editing expense failed on server engine:", error.message);
            return false;
        }
    };


    const downloadCSV = async () => {
        try {
            const params: Record<string, string> = {};

            if (startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const queryParams = new URLSearchParams(params).toString();

            const response = await API.get(`/expenses/download?${queryParams}`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `Expenses_Report_${startDate || 'All'}_to_${endDate || 'All'}.csv`);
            document.body.appendChild(link);

            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error("CSV Download Failed Frontend Error:", error.message);
            alert("Download failed! Ek baar console check kijiye.");
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [groupData, limit, page, startDate, endDate, delLoading, searchQuery]);


    useEffect(() => {
        if (user) {
            setIsPremiumUser(user.isPremium === true);
        } else {
            setIsPremiumUser(false);
        }
    }, [user]);

    return (
        <ExpenseContext.Provider value={{
            expenses,
            loading,
            delLoading,
            groupData,
            limit,
            page,
            totalPages,
            currentPage,
            searchQuery,
            startDate,
            endDate,
            setStartDate: (val) => setStartDate(val as string),
            setEndDate: (val) => setEndDate(val as string),
            setGroupData: (val) => setGroupData(val as string),
            setLimit: (val) => setLimit(val as number),
            setPage: (val) => setPage(val as number),
            setSearchQuery: (val) => setSearchQuery(val as string),
            deleteExpense,
            fetchExpenses,
            addExpense,
            downloadCSV,
            handlePayment,
            isPremiumModalOpen,
            setIsPremiumModalOpen,
            premiumLoad,
            setPremiumLoad,
            premiumMsg,
            setPremiumMsg,
            isPremiumUser,
            setIsPremiumUser,
            totalAmount,
            editingExpense,
            setEditingExpense,
            updateExpense
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error("useExpenses must be used within an ExpenseProvider");
    return context;
};
