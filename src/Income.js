import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Forms/Form";

const Income = (props) => {
  const updateFormHandler = (event, formKey) => {
    props.setIncomeForm({
      ...props.incomeForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="primary">
        Income
      </Typography>
      <Form
        form={props.incomeForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.inputFormSubmitHandler}
        btnName="add income"
        btnColor="primary"
      />
    </Box>
  );
};

export default Income;
