import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles({
  root: {
    width: 190,
  },
});

const Form = (props) => {
  const classes = useStyles();

  const fetchedAccountList = [];

  const fetchedCategoryList = [];

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // fetch accountList from server
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

    // fetch categoryList from server
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
  }, []);

  let formValues = props.form;
  // if we edit any transaction, shown form changes
  if (props.showEditedForm) formValues = props.editedForm;

  let accountsToChoose = <p>Loading...</p>;
  if (accountList.length > 0)
    accountsToChoose = accountList.map((account) => {
      return (
        <MenuItem key={account} value={account}>
          {account}
        </MenuItem>
      );
    });

  let categoriesToChoose = <p>Loading...</p>;
  if (categoryList.length > 0)
    categoriesToChoose = categoryList.map((category) => {
      return (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      );
    });

  let form = Object.keys(formValues).map((formKey) => {
    return formKey === "Date" ? (
      <Grid item key={formKey}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            inputVariant="outlined"
            label={formKey}
            margin="normal"
            size="small"
            className={classes.root}
            value={props.selectedDate}
            onChange={(e) => props.handleDateChange(e, formKey)}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    ) : (formKey === "From" && props.expenses) ||
      (formKey === "To" && props.income) ||
      (formKey === "From" && props.transfers) ? (
      <Grid item key={formKey}>
        <FormControl variant="outlined" margin="normal" size="small">
          <InputLabel>{props.accountsLabel}</InputLabel>
          <Select
            className={classes.root}
            value={formValues[formKey]}
            onChange={(e) => props.updateForm(e, formKey)}
          >
            {accountsToChoose}
          </Select>
        </FormControl>
      </Grid>
    ) : formKey === "To" && props.transfers ? (
      <Grid item key={formKey}>
        <FormControl variant="outlined" margin="normal" size="small">
          <InputLabel>{props.accountsLabelTransferTo}</InputLabel>
          <Select
            className={classes.root}
            value={formValues[formKey]}
            onChange={(e) => props.updateForm(e, formKey)}
          >
            {accountsToChoose}
          </Select>
        </FormControl>
      </Grid>
    ) : formKey === "To" && props.expenses ? (
      <Grid item key={formKey}>
        <FormControl variant="outlined" margin="normal" size="small">
          <InputLabel>To</InputLabel>
          <Select
            className={classes.root}
            value={formValues[formKey]}
            onChange={(e) => props.updateForm(e, formKey)}
          >
            {categoriesToChoose}
          </Select>
        </FormControl>
      </Grid>
    ) : (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </Grid>
    );
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler}>
        {form}
        <Button type="submit" variant="contained" color={props.btnColor}>
          {props.btnName}
        </Button>
      </form>
    </Grid>
  );
};

export default Form;
