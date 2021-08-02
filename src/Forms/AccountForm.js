import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Form';
import Accounts from '../Accounts';


const AccountForm = () => {
    const [accountForm, setAccountForm] = useState({
        Name: '',
        Category: '',
        Balance: ''
    });

    const [accountList, setAccountList] = useState([]);

    const accountFormSubmitHandler = (event) => {
        event.preventDefault();
        console.log("Expense form submitted: ")
        console.log(accountForm);

        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json', {
            method: "POST",
            body: JSON.stringify(accountForm)
        })
            .then(response => {
                setAccountList([
                    ...accountList,
                    accountForm
                ]);
                setAccountForm({
                    Name: '',
                    Category: '',
                    Balance: ''
                });
                console.log(accountList)
            })
    };

    const updateFormHandler = (event, formKey) => {
        setAccountForm({
            ...accountForm,
            [formKey]: event.target.value
        });
    };


    return (
        <Box>
            <Typography variant="h3" gutterBottom color="secondary">
                New Account
            </Typography>
            <Form form={accountForm} updateForm={updateFormHandler} formSubmitHandler={accountFormSubmitHandler} btnName="save account" btnColor="secondary" />
            <Accounts />
        </Box>
    )
};

export default AccountForm;