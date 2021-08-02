import React from 'react';

import ExpenseForm from './Forms/ExpenseForm';
import IncomeForm from './Forms/IncomeForm';
import TransferForm from './Forms/TransferForm';
import HistoryLog from './HistoryLog';

import Box from '@material-ui/core/Box';

const MainContent = () => {
    return (
        <Box>
            <ExpenseForm />
            <IncomeForm />
            <TransferForm />
            <HistoryLog />
        </Box>
    )
};

export default MainContent;