import React, { useState, useEffect } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';


const Accounts = () => {
    const [accountLog, setAccountLog] = useState({
        accountList: [],
        loading: true
    });



    useEffect(() => {
        fetch('https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json')
            .then(response => response.json())
            .then(data => {
                const fetchedList = [];
                for (let key in data) {
                    fetchedList.push({
                        ...data[key],
                        id: key
                    })
                }

                setAccountLog({
                    ...accountLog,
                    accountList: fetchedList,
                    loading: false
                })

                console.log(fetchedList)
            })
    }, []);

    let fetchedBankAccountList = <p>Loading...</p>;

    if (!accountLog.loading) {
        fetchedBankAccountList = accountLog.accountList.filter(account => account.Category === 'Bank account')
            .map(account => {
                return <Grid item key={account.id}>
                    <Card><CardContent>
                        <Box >
                            <Typography color="textSecondary" variant="h6">{`${account.Name} ${account.Balance} ILS`}</Typography>
                        </Box>
                    </CardContent></Card>
                </Grid>
            });
    }

    let fetchedCreditCardList = <p>Loading...</p>;

    if (!accountLog.loading) {
        fetchedCreditCardList = accountLog.accountList.filter(account => account.Category === 'Credit Card')
            .map(account => {
                return <Grid item key={account.id}>
                    <Card><CardContent>
                        <Box >
                            <Typography color="textSecondary" variant="h6">{`${account.Name} ${account.Balance} ILS`}</Typography>
                        </Box>
                    </CardContent></Card>
                </Grid>
            });
    }

    let fetchedCashList = <p>Loading...</p>;

    if (!accountLog.loading) {
        fetchedCashList = accountLog.accountList.filter(account => account.Category === 'Cash')
            .map(account => {
                return <Grid item key={account.id}>
                    <Card><CardContent>
                        <Box >
                            <Typography color="textSecondary" variant="h6">{`${account.Name} ${account.Balance} ILS`}</Typography>
                        </Box>
                    </CardContent></Card>
                </Grid>
            });
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom color="primary">
                Bank Account
            </Typography>
            {fetchedBankAccountList}
            <Typography variant="h5" gutterBottom color="primary">
                Credit Card
            </Typography>
            {fetchedCreditCardList}
            <Typography variant="h5" gutterBottom color="primary">
                Cash
            </Typography>
            {fetchedCashList}
        </Box>
    )
};

export default Accounts;