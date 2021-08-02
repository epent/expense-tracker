import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Forms/Form';


const Expenses = () => {
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
            <Typography variant="h3" gutterBottom color="secondary">
                Expenses
            </Typography>
            <Form form={expenseForm} updateForm={updateFormHandler} formSubmitHandler={expenseFormSubmitHandler} btnName="add expense" btnColor="secondary" />
        </Box>
    )
};

export default Expenses;