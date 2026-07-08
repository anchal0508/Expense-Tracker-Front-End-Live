import { useState } from "react";
import API from "../../axiosConfig";


const buttonActionForm = (setSubmitFormReload: React.Dispatch<React.SetStateAction<boolean>>) => {
    const [delLoading, setDelLoading] = useState<boolean>(false);

    const deleteExpense = async (expenseId: any) => {
        setDelLoading(true);
        try {
            const response = await API.delete(`/expenses/delete/${expenseId}`);
            console.log('expense deleted: ', response);

            setSubmitFormReload(prev => !prev);

            return response;
        } catch (error: any) {
            console.error("Error inside hook while deleting expense:", error.message);
        } finally {
            setDelLoading(false);
        }
    }

    const updateExpense = async (expeseId: any) => {
        try {

            const response = await API.put(`/expenses/update/${expeseId}`);
            setSubmitFormReload(prev => !prev);
            return response;

        } catch (error: any) {
            console.log('Error inside hook while updating Expense: ', error.message);
        }
    }
    return {
        deleteExpense,
        updateExpense,
        delLoading
    };
}

export default buttonActionForm;