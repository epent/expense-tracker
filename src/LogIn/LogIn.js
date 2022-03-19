import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";

import Form from "../Form/Form";
import { postData as getUser } from "../modules/fetch.js";

import { checkFormValidity } from "../modules/validate";

const LogIn = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
  }));
  const classes = useStyles();

  const [form, setForm] = useState({
    Email: "",
    Password: "",
  });

  const [formIsValid, setFormIsValid] = useState(true);

  const validityRules = {
    required: true,
    greaterThanZero: true,
    numeric: true,
  };

  const formUpdateHandler = (event, formKey) => {
    setForm({
      ...form,
      [formKey]: event.target.value,
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const response = await getUser("login", form);

    setForm({
      Email: "",
      Password: "",
    });

    // setFormIsValid(false);

    // const isValid = checkFormValidity(form, validityRules);

    // if (isValid) {
    //   setFormIsValid(true);

    //   const response = await postNewUser("signup", form);

    // setForm({
    // Email: "",
    // Password: "",
    // });

    //   if (!response) {
    //     props.openErrorDialog(`Failed to add new ${transcationType}.`);
    //   }
    // }
  };

  const validationErrors = {
    From: false,
    To: false,
    Amount: false,
  };
  const helperText = {};

  if (formIsValid === false) {
    if (form.From === "") {
      validationErrors.From = true;
      helperText.From = "Please fill in";
    }
    if (form.To === "") {
      validationErrors.To = true;
      helperText.To = "Please fill in";
    }
    if (form.Amount <= 0 || isNaN(Number(form.Amount))) {
      validationErrors.Amount = true;
      helperText.Amount = "Invalid input";
    }
    if (form.Amount === "") {
      validationErrors.Amount = true;
      helperText.Amount = "Please fill in";
    }
  }

  const addButton = (
    <Box my={2}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={() => {}}
      >
        Log In
      </Button>
    </Box>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <Box p={3}>
              <Typography variant="h5" color="textSecondary">
                Log in
              </Typography>
            </Box>
            <Box mx={3}>
              <Form
                formSubmitHandler={formSubmitHandler}
                updateForm={formUpdateHandler}
                form={form}
                validationErrors={validationErrors}
                helperText={helperText}
                formColor=""
                addButton={addButton}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </Box>
  );
};

export default LogIn;
