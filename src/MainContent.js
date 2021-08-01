import React, { useState } from 'react';

import ExpenseForm from './Forms/ExpenseForm';
import IncomeForm from './Forms/IncomeForm';
import TransferForm from './Forms/TransferForm';
import HistoryLog from './HistoryLog';


import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


const MainContent = () => {


    const [incomeForm, setIncomeForm] = useState({
        from: '',
        to: '',
        comment: '',
        date: '',
        amount: ''
    });

    const inputFormSubmitHandler = (event) => {
        event.preventDefault();
        console.log("Income form submitted: ")
        console.log(incomeForm);

        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json', {
            method: "POST",
            body: JSON.stringify(incomeForm)
        })
            .then(response => {
                setIncomeForm({
                    from: '',
                    to: '',
                    comment: '',
                    date: '',
                    amount: ''
                });
                console.log('Successfully submitted')
            })
    };




    return (
        <Box>
            <Typography variant="h3" gutterBottom color="secondary">
                Expenses
            </Typography>
            <ExpenseForm />
            <Typography variant="h3" gutterBottom color="primary">
                Income
            </Typography>
            <IncomeForm formSubmitHandler={inputFormSubmitHandler} incomeForm={incomeForm} setIncomeForm={setIncomeForm} />
            <Typography variant="h3" gutterBottom color="textSecondary">
                Transfer
            </Typography>
            <TransferForm />
            <Typography variant="h3" gutterBottom color="textSecondary">
                History
            </Typography>
            <HistoryLog />
        </Box>
    )
};

export default MainContent;