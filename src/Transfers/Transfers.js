import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import TransferForm from "../Transfers/TransferForm";
import TransferLog from "../Transfers/TransferLog";
import { fetchAccountsFromDB, fetchCategoriesFromDB } from "../modules/fetch";

const Transfers = (props) => {
  const [transferFormShow, setTransferFormShow] = useState(false);

  const [editTransferFormShow, setEditTransferFormShow] = useState(false);

  const [updatedTransferLog, setUpdatedTransferLog] = useState(false);

  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();
      const accountList = fetchedAccountList.map((account) => {
        return account.Name;
      });

      setAccountList(accountList);
    };
    fetchAccounts();
  }, [transferFormShow, editTransferFormShow]);

  // show the form when toggle "+Transfers" button
  const showTransferFormHandler = () => {
    setTransferFormShow((prevState) => !prevState);
  };

  // trigger fetch of acocunts and categories (useEffect) for the edit form
  const editTransferFormShowHandler = () => {
    setEditTransferFormShow((prevState) => !prevState);
  };

  // update the list of transfers
  const updateTransferLogHandler = () => {
    setUpdatedTransferLog((prevState) => !prevState);
  };

  const transferForm = (
    <Box mt={3}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={showTransferFormHandler}
          >
            Transfers
          </Button>
        </Grid>
        <Grid item xs={12}>
          {transferFormShow && (
            <TransferForm
              updateTransferLog={updateTransferLogHandler}
              updateHomeHandler={props.updateHomeHandler}
              accountList={accountList}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid container>
      {props.showTransferForm && transferForm}
      <Grid item xs={12}>
        {props.showTransferLog && (
          <TransferLog
            sliceLog={props.sliceLog}
            updatedTransferLog={updatedTransferLog}
            updateTransferLog={updateTransferLogHandler}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
            setEditExpenseFormShow={editTransferFormShowHandler}
            accountList={accountList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Transfers;
