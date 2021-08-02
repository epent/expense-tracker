import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Form';

const IncomeForm = (props) => {
    const [incomeForm, setIncomeForm] = useState({
        From: '',
        To: '',
        Comment: '',
        Date: '',
        Amount: ''
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
                    From: '',
                    To: '',
                    Comment: '',
                    Date: '',
                    Amount: ''
                });
                console.log('Successfully submitted')
            })
    };

    const updateFormHandler = (event, formKey) => {
        setIncomeForm({
            ...incomeForm,
            [formKey]: event.target.value
        });
    };

    return (
        <Box>
            <Typography variant="h3" gutterBottom color="primary">
                Income
            </Typography>
            <Form form={incomeForm} updateForm={updateFormHandler} formSubmitHandler={inputFormSubmitHandler} btnName="add income" btnColor="primary" />
        </Box>
    )
};

export default IncomeForm;