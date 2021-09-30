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

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler}>
        <Box>
          {windowFrom}
          {windowTo}
          <TextField
            {...commonProps}
            className={classes.root}
            label="Amount"
            onChange={(e) => props.updateForm(e, "Amount")}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              {...commonProps}
              className={classes.root}
              label="Date"
              variant="inline"
              autoOk
              disableToolbar
              format="dd/MM/yyyy"
              inputVariant="outlined"
            />
          </MuiPickersUtilsProvider>
          <TextField
            {...commonProps}
            fullWidth
            label="Comment"
            multiline
            minRows="2"
            onChange={(e) => props.updateForm(e, "Comment")}
          />
        </Box>
        {/* <IconButton size="medium" type="submit">
            <AddCircleIcon style={{ fontSize: 50 }}/>
          </IconButton> */}
        <Button type="submit" variant="contained">
          Add
        </Button>
      </form>
    </Grid>
  );
};

export default NewForm;
