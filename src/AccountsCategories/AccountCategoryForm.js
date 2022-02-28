import React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import makeStyles from '@mui/styles/makeStyles';

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

const AccountCategoryForm = (props) => {
  const classes = useStyles();

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

  let form = Object.keys(formValues).map((formKey) => {
    const commonProps = {
      variant: "outlined",
      margin: "normal",
      size: "small",
      color: props.formColor,
      label: formKey,
      value: formValues[formKey],
      onChange: (e) => props.updateForm(e, formKey),
      className: classes.textField,
    };

    return formKey === "Category" ? (
      <TextField
        {...commonProps}
        select
        error={props.invalidInputCategory}
        helperText={props.helperTextCategory}
      >
        {accountCategoriesToChoose}
      </TextField>
    ) : formKey === "Name" ? (
      <TextField
        {...commonProps}
        error={props.invalidInputName}
        helperText={props.helperTextName}
      />
    ) : (
      <TextField
        {...commonProps}
        error={props.invalidInputAmount}
        helperText={props.helperTextAmount}
      />
    );
  });

  return (
    <Grid container>
      <form onSubmit={props.formSubmitHandler} className={classes.form}>
        <FormControl className={classes.formControl}>
          <Box>{form}</Box>
          <IconButton size="medium" type="submit" color={props.formColor}>
            <AddCircleIcon style={{ fontSize: 50 }} />
          </IconButton>
        </FormControl>
      </form>
    </Grid>
  );
};

export default AccountCategoryForm;
