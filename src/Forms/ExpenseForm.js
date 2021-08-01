import React, { useState } from 'react';

import Box from '@material-ui/core/Box';

import Form from './Form';


const ExpenseForm = () => {
    const [expenseForm, setExpenseForm] = useState({
        From: '',
        To: '',
        Comment: '',
        Date: '',
        Amount: ''
    });

    const [expenseList, setExpenseList] = useState([]);

    const expenseFormSubmitHandler = (event) => {
        event.preventDefault();
        console.log("Expense form submitted: ")
        console.log(expenseForm);

        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json', {
            method: "POST",
            body: JSON.stringify(expenseForm)
        })
            .then(response => {
                setExpenseList([
                    ...expenseList,
                    expenseForm
                ]);
                setExpenseForm({
                    From: '',
                    To: '',
                    Comment: '',
                    Date: '',
                    Amount: ''
                });
                console.log(expenseList)
            })
    };

    const updateFormHandler = (event, formKey) => {
        setExpenseForm({
            ...expenseForm,
            [formKey]: event.target.value
        });
    };


    return (
        <Box>
            <Form form={expenseForm} updateForm={updateFormHandler} formSubmitHandler={expenseFormSubmitHandler} btnName="expense" btnColor="secondary" />
        </Box>
    )
};

export default ExpenseForm;