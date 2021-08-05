import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const AccountLog = () => {
  const classes = useStyles();

  const [accountLog, setAccountLog] = useState({
    accountList: [],
    loading: true,
  });

  const accountNames = [];
  const fetchedAccountList = [];

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let accountName in data) {
          accountNames.push(accountName);
        }
        console.log(accountNames);
      })
      .then((response) => {
        accountNames.map((accountName) => {
          fetch(
            "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
              accountName +
              ".json"
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);


              setAccountLog({
                ...accountLog,
                accountList: Array(data),
                loading: false,
              });
            });
        });
      });
  }, []);

  let accountList = <p>Loading...</p>;

  // if (!accountLog.loading) {
  //   accountList = accountLog.accountList
  //     .map((category) => {
  //       return (
  //         [Array(category)].map((account) => {
  //           return (
  //             <Grid item key={account.id}>
  //               <Card className={classes.root} variant="outlined">
  //                 <CardContent>
  //                   <Typography
  //                     color="textSecondary"
  //                     variant="h6"
  //                     align="left"
  //                   >{`${account.Name}`}</Typography>
  //                   <Typography
  //                     color="textSecondary"
  //                     variant="h6"
  //                     align="right"
  //                   >{`${account.Balance} ILS`}</Typography>
  //                 </CardContent>
  //               </Card>
  //             </Grid>
  //           );
  //         })
  //       );
  //     })

  // }

  //   <Typography color="textSecondary" variant="h6" align="left">
  //   {category.Category}
  // </Typography>

  // let fetchedBankAccountList = <p>Loading...</p>;

  // if (!accountLog.loading) {
  //   fetchedBankAccountList = accountLog.accountList
  //     .filter((account) => account.Category === "Bank account")
  //     .map((account) => {
  //       return (
  //         <Grid item key={account.id}>
  //           <Card className={classes.root} variant="outlined">
  //             <CardContent>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="left"
  //               >{`${account.Name}`}</Typography>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="right"
  //               >{`${account.Balance} ILS`}</Typography>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       );
  //     });
  // }

  // let fetchedCreditCardList = <p>Loading...</p>;

  // if (!accountLog.loading) {
  //   fetchedCreditCardList = accountLog.accountList
  //     .filter((account) => account.Category === "Credit Card")
  //     .map((account) => {
  //       return (
  //         <Grid item key={account.id}>
  //           <Card className={classes.root} variant="outlined">
  //             <CardContent>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="left"
  //               >{`${account.Name}`}</Typography>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="right"
  //               >{`${account.Balance} ILS`}</Typography>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       );
  //     });
  // }

  // let fetchedCashList = <p>Loading...</p>;

  // if (!accountLog.loading) {
  //   fetchedCashList = accountLog.accountList
  //     .filter((account) => account.Category === "Cash")
  //     .map((account) => {
  //       return (
  //         <Grid item key={account.id}>
  //           <Typography variant="h5" gutterBottom color="primary">
  //             {account.Name}
  //           </Typography>
  //           <Card className={classes.root} variant="outlined">
  //             <CardContent>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="left"
  //               >{`${account.Name}`}</Typography>
  //               <Typography
  //                 color="textSecondary"
  //                 variant="h6"
  //                 align="right"
  //               >{`${account.Balance} ILS`}</Typography>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       );
  //     });
  // }

  return (
    <Box>
      <Grid container spacing={2}>
        {accountList}
      </Grid>
    </Box>
  );
};

export default AccountLog;
