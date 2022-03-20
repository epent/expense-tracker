import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";

import Form from "../Form/Form";
import { postData as getUser } from "../modules/fetch.js";

import { checkSignFormValidity } from "../modules/validate";

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
    email: true,
    minLength: true,
  };

  const formUpdateHandler = (event, formKey) => {
    setForm({
      ...form,
      [formKey]: event.target.value,
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkSignFormValidity(form, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await getUser("login", form);

      setForm({
        Email: "",
        Password: "",
      });

      if (response.status === 401) {
        props.openErrorDialog("Seems that email/password is incorrect.");
      }

      if (!response) {
        props.openErrorDialog("Failed to login.");
      }
    }
  };

  const validationErrors = {
    Email: false,
    Password: false,
  };
  const helperText = {};

  if (formIsValid === false) {
    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        form.Email
      )
    ) {
      validationErrors.Email = true;
      helperText.Email = "Invalid email";
    }
    if (form.Password.length < 7) {
      validationErrors.Password = true;
      helperText.Password = "Password is too short";
    }
    if (form.Email === "") {
      validationErrors.Email = true;
      helperText.Email = "Please fill in";
    }
    if (form.Password === "") {
      validationErrors.Password = true;
      helperText.Password = "Please fill in";
    }
  }

  const addButton = (
    <Box my={2}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        type="submit"
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
