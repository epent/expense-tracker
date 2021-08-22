import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import IncomeForm from "../Income/IncomeForm";
import IncomeLog from "../Income/IncomeLog";

const Income = (props) => {
  const [incomeFormShow, setIncomeFormShow] = useState(false);

  const [editIncomeFormShow, setEditIncomeFormShow] = useState(false);

  const [updatedIncomeLog, setUpdatedIncomeLog] = useState(false);

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
            categoryList={categoryList}
          />
        )}
      </Grid>
    </Grid>
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
            categoryList={categoryList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Income;
