import React from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const Form = (props) => {
  let formValues = props.form;
  // if we edit any transaction, shown form changes
  if (props.showEditedForm) formValues = props.editedForm;

  let form = Object.keys(formValues).map((formKey) => {
    return (
      <Grid item key={formKey}>
        <TextField
          label={formKey}
          variant="outlined"
          margin="normal"
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
