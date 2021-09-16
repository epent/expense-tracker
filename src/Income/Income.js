import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import IncomeForm from "../Income/IncomeForm";
import IncomeLog from "../Income/IncomeLog";
import { fetchAccountsFromDB } from "../modules/fetch";

const Income = (props) => {
  const [incomeFormShow, setIncomeFormShow] = useState(false);

  const [editIncomeFormShow, setEditIncomeFormShow] = useState(false);

  const [updatedIncomeLog, setUpdatedIncomeLog] = useState(false);

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
  }, [incomeFormShow, editIncomeFormShow]);

  // show the form when toggle "+Income" button
  const showIncomeFormHandler = () => {
    setIncomeFormShow((prevState) => !prevState);
  };

  // trigger fetch of acocunts and categories (useEffect) for the edit form
  const editIncomeFormShowHandler = () => {
    setEditIncomeFormShow((prevState) => !prevState);
  };

  // update the list of income
  const updateIncomeLogHandler = () => {
    setUpdatedIncomeLog((prevState) => !prevState);
  };

  const incomeForm = (
    <Box mt={3}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={showIncomeFormHandler}
          >
            Income
          </Button>
        </Grid>
        <Grid item xs={12}>
          {incomeFormShow && (
            <IncomeForm
              updateIncomeLog={updateIncomeLogHandler}
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
      {props.showIncomeForm && incomeForm}
      <Grid item xs={12}>
        {props.showIncomeLog && (
          <IncomeLog
            sliceLog={props.sliceLog}
            updatedIncomeLog={updatedIncomeLog}
            updateIncomeLog={updateIncomeLogHandler}
            updateHome={props.updateHome}
            updateHomeHandler={props.updateHomeHandler}
            setEditIncomeFormShow={editIncomeFormShowHandler}
            accountList={accountList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Income;
