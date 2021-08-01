import React, { useState, useEffect } from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: 500,
    }
});


const HistoryLog = (props) => {
    const classes = useStyles();

    const [expenseLog, setExpenseLog] = useState({
        expenseList: [],
        loading: true
    });

    const [incomeLog, setIncomeLog] = useState({
        incomeList: [],
        loading: true
    });




    useEffect(() => {
        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const fetchedList = [];
                for (let key in data) {
                    fetchedList.push({
                        ...data[key],
                        id: key
                    })
                }

                setExpenseLog({
                    ...expenseLog,
                    expenseList: fetchedList,
                    loading: false
                })
            })

        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const fetchedList = [];
                for (let key in data) {
                    fetchedList.push({
                        ...data[key],
                        id: key
                    })
                }

                setIncomeLog({
                    ...incomeLog,
                    incomeList: fetchedList,
                    loading: false
                })
            })
    }, []);

    let fetchedExpenseList = <p>Loading...</p>
    if (!expenseLog.loading) fetchedExpenseList = expenseLog.expenseList.map(expense => {
        return <Grid item key={expense.id}>
            <Card className={classes.root}><CardContent>
                <Box >
                    <Typography color="secondary" variant="h6">{`${expense.From} --> ${expense.To} ${expense.Amount} ILS ${expense.date}`}</Typography>
                    <Typography color="textSecondary" variant="body1">{expense.Comment}</Typography>
                </Box>
            </CardContent>
            </Card>
        </Grid>
    })

    let fetchedIncomeList;

    if (!incomeLog.loading) fetchedIncomeList = incomeLog.incomeList.map(income => {
        return <Grid item key={income.id}>
            <Card className={classes.root}><CardContent>
                <Box >
                    <Typography color="primary" variant="h6">{`${income.from} --> ${income.to} ${income.amount} ILS ${income.date}`}</Typography>
                    <Typography color="textSecondary" variant="body1">{income.comment}</Typography>
                </Box>
            </CardContent></Card>
        </Grid>
    })

    return (
        <Box>
            <Grid container spacing={2}>
                {fetchedExpenseList}
            </Grid>
            <Grid container spacing={2}>
                {fetchedIncomeList}
            </Grid>
        </Box>
    )
};

export default HistoryLog;