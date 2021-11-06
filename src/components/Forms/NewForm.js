import React from "react";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("xl")]: {
      width: "50%",
    },
  },
}));

const NewForm = (props) => {
  const classes = useStyles();

  let accountsToChoose = <p>You have no accounts yet</p>;
  if (props.accountList && props.accountList.length > 0)
    accountsToChoose = props.accountList.map((account) => {
      return (
        <MenuItem key={account} value={account}>
          {account}
        </MenuItem>
      );
    });

  let categoriesToChoose = <p>You have no categories yet...</p>;
  if (props.categoryList && props.categoryList.length > 0)
    categoriesToChoose = props.categoryList.map((category) => {
      return (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      );
    });

  const formValues = props.form;

  let form = Object.keys(formValues).map((formKey) => {
    const commonProps = {
      variant: "outlined",
      margin: "normal",
      size: "small",
      color: "secondary",
      label: formKey,
      value: formValues[formKey],
    };

    return formKey === "From" && props.transactionType === "income" ? (
      <TextField
        {...commonProps}
        className={classes.textField}
        error={props.invalidInputFrom}
        helperText={props.helperTextFrom}
        onChange={(e) => props.updateForm(e, formKey)}
      />
    ) : formKey === "From" ? (
      <TextField
        {...commonProps}
        select
        className={classes.textField}
        error={props.invalidInputFrom}
        helperText={props.helperTextFrom}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "To" && props.transactionType === "expense" ? (
      <TextField
        {...commonProps}
        select
        className={classes.textField}
        error={props.invalidInputTo}
        helperText={props.helperTextTo}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {categoriesToChoose}
      </TextField>
    ) : formKey === "To" ? (
      <TextField
        {...commonProps}
        select
        className={classes.textField}
        error={props.invalidInputTo}
        helperText={props.helperTextTo}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "Comment" ? (
      <TextField
        {...commonProps}
        fullWidth
        multiline
        minRows="2"
        onChange={(e) => props.updateForm(e, formKey)}
      />
    ) : formKey === "Date" ? (
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
          className={classes.textField}
          value={props.selectedDate}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </MuiPickersUtilsProvider>
    ) : formKey === "Amount" ? (
      <TextField
        {...commonProps}
        className={classes.textField}
        onChange={(e) => props.updateForm(e, formKey)}
        error={props.invalidInputAmount}
        helperText={props.helperTextAmount}
      />
    ) : (
      <TextField
        {...commonProps}
        className={classes.textField}
        onChange={(e) => props.updateForm(e, formKey)}
      />
    );
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler}>
        <FormControl>
          <Box className={classes.root}>{form}</Box>
          <IconButton size="medium" type="submit" color="secondary">
            <AddCircleIcon style={{ fontSize: 50 }} />
          </IconButton>
        </FormControl>
      </form>
    </Grid>
  );
};

export default NewForm;
