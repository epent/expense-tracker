import React from "react";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
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
    width: 190,
  },
});

const Form = (props) => {
  const classes = useStyles();

  let formValues = props.form;
  // if we edit any transaction, shown form changes
  if (props.showEditedForm) formValues = props.editedForm;

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

  let accountCategoriesToChoose;
  if (props.accountCategoriesList)
    accountCategoriesToChoose = props.accountCategoriesList.map((category) => {
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
      (formKey === "From" && props.transfers) ? (
      <Grid item key={formKey}>
        <TextField
          select
          variant="outlined"
          margin="normal"
          size="small"
          label={props.accountsLabel}
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputFrom}
          helperText={props.helperTextFrom}
          onChange={(e) => props.updateForm(e, formKey)}
        >
          {accountsToChoose}
        </TextField>
      </Grid>
    ) : formKey === "From" && props.income ? (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputFrom}
          helperText={props.helperTextFrom}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </Grid>
    ) : (formKey === "To" && props.income) ||
      (formKey === "To" && props.transfers) ? (
      <Grid item key={formKey}>
        <TextField
          select
          variant="outlined"
          margin="normal"
          size="small"
          label="To"
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputTo}
          helperText={props.helperTextTo}
          onChange={(e) => props.updateForm(e, formKey)}
        >
          {accountsToChoose}
        </TextField>
      </Grid>
    ) : formKey === "To" && props.expenses ? (
      <Grid item key={formKey}>
        <TextField
          select
          variant="outlined"
          margin="normal"
          size="small"
          label="To"
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputTo}
          helperText={props.helperTextTo}
          onChange={(e) => props.updateForm(e, formKey)}
        >
          {categoriesToChoose}
        </TextField>
      </Grid>
    ) : formKey === "Category" ? (
      <Grid item key={formKey}>
        <TextField
          select
          variant="outlined"
          margin="normal"
          size="small"
          label={formKey}
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputCategory}
          helperText={props.helperTextCategory}
          onChange={(e) => props.updateForm(e, formKey)}
        >
          {accountCategoriesToChoose}
        </TextField>
      </Grid>
    ) : formKey === "Comment" ? (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          multiline
          maxRows={6}
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </Grid>
    ) : formKey === "Amount" || formKey === "Balance" ? (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputAmount}
          helperText={props.helperTextAmount}
          onChange={(e) => props.updateForm(e, formKey)}
        />
      </Grid>
    ) : formKey === "Name" ? (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
          size="small"
          className={classes.root}
          value={formValues[formKey]}
          error={props.invalidInputName}
          helperText={props.helperTextName}
          onChange={(e) => props.updateForm(e, formKey)}
        />
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
