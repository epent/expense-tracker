import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import TransferForm from "../Transfers/TransferForm";
import TransferLog from "../Transfers/TransferLog";

const Transfers = (props) => {
  const [transferFormShow, setTransferFormShow] = useState(false);

  const [editTransferFormShow, setEditTransferFormShow] = useState(false);

  const [updatedTransferLog, setUpdatedTransferLog] = useState(false);

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const fetchedAccountList = [];
  const fetchedCategoryList = [];

  useEffect(() => {
    // fetch accountList from server when form is opened
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key,
          });
        }

        const accountList = fetchedAccountList.map((account) => {
          return account.Name;
        });

        setAccountList(accountList);
      });

    // fetch categoryList from server when form is opened
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedCategoryList.push({
            ...data[key],
            id: key,
          });
        }

        const categoryList = fetchedCategoryList.map((category) => {
          return category.Name;
        });

        setCategoryList(categoryList);
      });
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
          />
        )}
      </Grid>
    </Grid>
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
            categoryList={categoryList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Transfers;
