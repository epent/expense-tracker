import React from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import makeStyles from "@mui/styles/makeStyles";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "1000px",
  },
  formControl: {
    width: "100%",
  },
  textField: {
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
  },
  signUp50: {
    [theme.breakpoints.up("xs")]: {
      width: "50%",
    },
  },
}));

const Form = (props) => {
  const classes = useStyles();

  let accountsToChoose = <p>You have no accounts yet</p>;
  if (props.accountList && props.accountList.length > 0)
    accountsToChoose = props.accountList.map((account) => {
      return (
        <MenuItem key={account.name} value={account.name}>
          {account.name}
        </MenuItem>
      );
    });

  let categoriesToChoose = <p>You have no categories yet...</p>;
  if (props.categoryList && props.categoryList.length > 0)
    categoriesToChoose = props.categoryList.map((category) => {
      return (
        <MenuItem key={category.name} value={category.name}>
          {category.name}
        </MenuItem>
      );
    });

  let accountCategoriesToChoose;
  if (props.accountCategoriesList)
    accountCategoriesToChoose = props.accountCategoriesList.map((category) => {
      return (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      );
    });

  const formValues = props.form;

  const form = Object.keys(formValues).map((formKey) => {
    const commonProps = {
      key: formKey,
      variant: "outlined",
      margin: "normal",
      size: "small",
      color: props.formColor,
      label:
        formKey === "FirstName"
          ? "First name"
          : formKey === "LastName"
          ? "Last name"
          : formKey,
      value: formValues[formKey],
      onChange: (e) => props.updateForm(e, formKey),
      className:
        formKey === "FirstName" || formKey === "LastName"
          ? classes.signUp50
          : classes.textField,
      error: props.validationErrors[formKey],
      helperText: props.helperText[formKey],
    };

    const selectAccountField = (
      <TextField {...commonProps} select>
        {accountsToChoose}
      </TextField>
    );

    const selectCategoryField = (
      <TextField {...commonProps} select>
        {categoriesToChoose}
      </TextField>
    );

    const selectCategoryOfAccountField = (
      <TextField {...commonProps} select>
        {accountCategoriesToChoose}
      </TextField>
    );

    const textField = (
      <TextField
        {...commonProps}
        type={formKey === "Password" ? "password" : null}
      />
    );

    const dateField = (
      <LocalizationProvider dateAdapter={AdapterDateFns} key={formKey}>
        <DatePicker
          label={formKey}
          value={props.selectedDate}
          inputFormat="dd/MM/yyyy"
          onChange={(e) => props.updateForm(e, formKey)}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              size="small"
              className={classes.textField}
            />
          )}
        />
      </LocalizationProvider>
    );

    let field;

    if (props.transactionType === "expense") {
      field =
        formKey === "From"
          ? selectAccountField
          : formKey === "To"
          ? selectCategoryField
          : formKey === "Date"
          ? dateField
          : textField;
    }

    if (props.transactionType === "income") {
      field =
        formKey === "To"
          ? selectAccountField
          : formKey === "Date"
          ? dateField
          : textField;
    }

    if (props.transactionType === "transfer") {
      field =
        formKey === "Amount"
          ? textField
          : formKey === "Date"
          ? dateField
          : selectAccountField;
    }
    if (!props.transactionType) {
      field = formKey === "Category" ? selectCategoryOfAccountField : textField;
    }
    return field;
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler} className={classes.form}>
        <FormControl className={classes.formControl}>
          <Box>{form}</Box>
          {props.addButton}
        </FormControl>
      </form>
    </Grid>
  );
};

export default Form;
