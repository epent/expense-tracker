import React from "react";

import Box from "@material-ui/core/Box";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles({
  root: {
    width: 338,
  },
});

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

  const commonProps = {
    variant: "outlined",
    margin: "normal",
    size: "small",
  };

  let windowFrom;

  props.transactionType === "income"
    ? (windowFrom = (
        <TextField {...commonProps} className={classes.root} label="From" />
      ))
    : (windowFrom = (
        <TextField
          {...commonProps}
          select
          className={classes.root}
          label="From"
          onChange={(e) => props.updateForm(e, "From")}
        >
          {accountsToChoose}
        </TextField>
      ));

  let windowTo;

  props.transactionType === "expense"
    ? (windowTo = (
        <TextField
          {...commonProps}
          select
          className={classes.root}
          label="To"
          onChange={(e) => props.updateForm(e, "To")}
        >
          {categoriesToChoose}
        </TextField>
      ))
    : (windowTo = (
        <TextField
          {...commonProps}
          select
          className={classes.root}
          label="To"
          onChange={(e) => props.updateForm(e, "To")}
        >
          {accountsToChoose}
        </TextField>
      ));

  const formValues = props.form;

  let form = Object.keys(formValues).map((formKey) => {
    return formKey === "From" && props.transactionType === "income" ? (
      <TextField
        {...commonProps}
        className={classes.root}
        label={formKey}
        value={formValues[formKey]}
      />
    ) : formKey === "From" ? (
      <TextField
        {...commonProps}
        select
        className={classes.root}
        label={formKey}
        value={formValues[formKey]}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "To" && props.transactionType === "expense" ? (
      <TextField
        {...commonProps}
        select
        className={classes.root}
        label={formKey}
        value={formValues[formKey]}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {categoriesToChoose}
      </TextField>
    ) : formKey === "To" ? (
      <TextField
        {...commonProps}
        select
        className={classes.root}
        label={formKey}
        value={formValues[formKey]}
        onChange={(e) => props.updateForm(e, formKey)}
      >
        {accountsToChoose}
      </TextField>
    ) : formKey === "Comment" ? (
      <TextField
        {...commonProps}
        fullWidth
        label={formKey}
        value={formValues[formKey]}
        multiline
        minRows="2"
        onChange={(e) => props.updateForm(e, formKey)}
      />
    ) : (
      <TextField
        {...commonProps}
        className={classes.root}
        label={formKey}
        value={formValues[formKey]}
        onChange={(e) => props.updateForm(e, formKey)}
      />
    );
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler}>
        <Box>{form}</Box>
        <IconButton size="medium" type="submit">
          <AddCircleIcon style={{ fontSize: 50 }} />
        </IconButton>
      </form>
    </Grid>
  );
};

export default NewForm;
