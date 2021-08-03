import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Form from './Forms/Form';

const Transfers = (props) => {
    const updateFormHandler = (event, formKey) => {
        props.setTransferForm({
            ...props.transferForm,
            [formKey]: event.target.value
        });
    };

    return (
        <Box>
            <Typography variant="h3" gutterBottom color="textSecondary">
                Transfer
            </Typography>
            <Form form={props.transferForm} updateForm={updateFormHandler} formSubmitHandler={props.transferFormSubmitHandler} btnName="add transfer" btnColor="primary" />
        </Box>
    )
};

export default Transfers;