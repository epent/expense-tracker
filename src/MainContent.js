import React from 'react';

import Expenses from './Expenses';
import Income from './Income';
import Transfers from './Transfers';
import HistoryLog from './HistoryLog';

import Box from '@material-ui/core/Box';

const MainContent = () => {
    return (
        <Box>
            <Expenses />
            <Income />
            <Transfers />
            <HistoryLog />
        </Box>
    )
};

export default MainContent;