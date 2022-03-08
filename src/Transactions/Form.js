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

  let form = Object.keys(formValues).map((formKey) => {
    const commonProps = {
      variant: "outlined",
      margin: "normal",
      size: "small",
      color: props.transactionType === "expense" ? "secondary" : "primary",
      label: formKey,
      value: formValues[formKey],
      onChange: (e) => props.updateForm(e, formKey),
    };

    return formKey === "From" && props.transactionType === "income" ? (
      <TextField
        {...commonProps}
        key={formKey}
        className={classes.textField}
        error={props.invalidInputFrom}
        helperText={props.helperTextFrom}
      />
    ) : formKey === "From" ? (
      <TextField
        {...commonProps}
        key={formKey}
        select
        className={classes.textField}
        error={props.invalidInputFrom}
        helperText={props.helperTextFrom}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "To" && props.transactionType === "expense" ? (
      <TextField
        {...commonProps}
        key={formKey}
        select
        className={classes.textField}
        error={props.invalidInputTo}
        helperText={props.helperTextTo}
      >
        {categoriesToChoose}
      </TextField>
    ) : formKey === "To" ? (
      <TextField
        {...commonProps}
        key={formKey}
        select
        className={classes.textField}
        error={props.invalidInputTo}
        helperText={props.helperTextTo}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "Comment" ? (
      <TextField
        {...commonProps}
        key={formKey}
        fullWidth
        multiline
        minRows="2"
      />
    ) : formKey === "Date" ? (
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
    ) : formKey === "Amount" ? (
      <TextField
        {...commonProps}
        key={formKey}
        className={classes.textField}
        error={props.invalidInputAmount}
        helperText={props.helperTextAmount}
      />
    ) : (
      <TextField {...commonProps} key={formKey} className={classes.textField} />
    );
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
