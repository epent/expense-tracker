import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Form';

const TransferForm = (props) => {
    const [transferForm, setTransferForm] = useState({
        From: '',
        To: '',
        Comment: '',
        Date: '',
        Amount: ''
    });

    const transferFormSubmitHandler = (event) => {
        event.preventDefault();
        console.log("Transfer form submitted: ")
        console.log(transferForm);

        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json', {
            method: "POST",
            body: JSON.stringify(transferForm)
        })
            .then(response => {
                setTransferForm({
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
        setTransferForm({
            ...transferForm,
            [formKey]: event.target.value
        });
    };

    return (
        <Box>
            <Typography variant="h3" gutterBottom color="textSecondary">
                Transfer
            </Typography>
            <Form form={transferForm} updateForm={updateFormHandler} formSubmitHandler={transferFormSubmitHandler} btnName="transfer" btnColor="primary" />
        </Box>
    )
};

export default TransferForm;