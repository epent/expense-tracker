import React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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

  const formValues = props.form;

  const form = Object.keys(formValues).map((formKey) => {
    const commonProps = {
      key: formKey,
      variant: "outlined",
      margin: "normal",
      size: "small",
      color: props.transactionType === "expense" ? "secondary" : "primary",
      label: formKey,
      value: formValues[formKey],
      onChange: (e) => props.updateForm(e, formKey),
      className: classes.textField,
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

    const textField = <TextField {...commonProps} />;

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
    return field;
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler} className={classes.form}>
        <FormControl className={classes.formControl}>
          <Box>{form}</Box>
          <IconButton size="medium" type="submit" color={props.addButtonColor}>
            <AddCircleIcon style={{ fontSize: 50 }} />
          </IconButton>
        </FormControl>
      </form>
    </Grid>
  );
};

export default Form;
