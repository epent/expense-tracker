import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

// import {
//   fetchAccountsFromDB,
//   deleteTransactionFromDB as deleteAccountFromDB,
// } from "../../modules/fetch";

const AccountList = (props) => {
  // const [accountLog, setAccountLog] = useState([]);

  // const [accountForm, setAccountForm] = useState({
  //   Name: "",
  //   Category: "",
  //   Balance: 0,
  // });

  // //  id of the account we want to edit
  // const [editedAccountId, setEditedAccountId] = useState("");

  // // if want to edit transaction, need to show the form again
  // const [showAccountForm, setShowAccountForm] = useState(false);

  // const deleteAccountHandler = (accountId) => {
  //   deleteAccountFromDB("accounts", accountId);

  //   const updateAccountLog = () => {
  //     const updatedExpenseLog = accountLog.filter(
  //       (expense) => expense.id !== accountId
  //     );

  //     setAccountLog(updatedExpenseLog);
  //   };
  //   updateAccountLog();
  // };

  // const editAccountHandler = (account) => {
  //   setAccountForm({
  //     Name: account.Name,
  //     Category: account.Category,
  //     Balance: account.Balance,
  //   });

  //   setEditedAccountId(account.id);

  //   if (editedAccountId === account.id) {
  //     setShowAccountForm((prevState) => !prevState);
  //   }
  // };

  let accountList = (
    <Typography variant="subtitle2">
      Please add first <Link href="/accounts" color="primary">account</Link>
    </Typography>
  );
  if (props.accountList && props.accountList.length > 0) {
    accountList = props.accountList.map((account) => {
      return (
        <Grid item key={account.name}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle2">{account.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">{account.balance}</Typography>
            </Grid>
          </Grid>
          <Box my={1}>
            <Divider />
          </Box>
        </Grid>
      );
    });
  }

  return (
    <Box>
      <Box mx={5} my={2}>
        <Grid container direction="column" spacing={1}>
          {accountList}
        </Grid>
      </Box>
    </Box>
  );
};

export default AccountList;
