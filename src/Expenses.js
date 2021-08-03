import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Forms/Form';


const Expenses = (props) => {
    const updateFormHandler = (event, formKey) => {
        props.setExpenseForm({
            ...props.expenseForm,
            [formKey]: event.target.value
        });
    };


    return (
        <Box>
            <Typography variant="h3" gutterBottom color="secondary">
                Expenses
            </Typography>
            <Form form={props.expenseForm} updateForm={updateFormHandler} formSubmitHandler={props.expenseFormSubmitHandler} btnName="add expense" btnColor="secondary" />
        </Box>
    )
};

export default Expenses;