import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";

import Form from "../Form/Form";
import { postData as postNewUser } from "../modules/fetch.js";

import { checkSignFormValidity } from "../modules/validate";

const SignUp = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: 350,
    },
  }));
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
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

      const response = await postNewUser("signup", form);

      if (response.user) {
        localStorage.setItem("token", response.token);
        history.replace(from);
      } else {
        if (response.status === 422) {
          props.openErrorDialog("User with such email already exists.");
        } else {
          setForm({
            FirstName: "",
            LastName: "",
            Email: "",
            Password: "",
          });
          props.openErrorDialog("Failed to signup.");
        }
      }
    }
  };

  const validationErrors = {
    FirstName: false,
    LastName: false,
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
    if (form.FirstName === "") {
      validationErrors.FirstName = true;
      helperText.FirstName = "Please fill in";
    }
    if (form.LastName === "") {
      validationErrors.LastName = true;
      helperText.LastName = "Please fill in";
    }
  }

  const addButton = (
    <Box my={2}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
      >
        Sign Up
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
                Sign up
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

export default SignUp;
