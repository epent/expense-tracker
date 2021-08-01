import React, { useState } from 'react';

import ExpenseForm from './Forms/ExpenseForm';
import IncomeForm from './Forms/IncomeForm';
import TransferForm from './Forms/TransferForm';
import HistoryLog from './HistoryLog';


import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


const MainContent = () => {
    return (
        <Box>
            <Typography variant="h3" gutterBottom color="secondary">
                Expenses
            </Typography>
            <ExpenseForm />
            <Typography variant="h3" gutterBottom color="primary">
                Income
            </Typography>
            <IncomeForm />
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