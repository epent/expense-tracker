import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Forms/Form";

const Categories = (props) => {
  const updateFormHandler = (event, formKey) => {
    props.setCategoryForm({
      ...props.categoryForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="secondary">
        Categories
      </Typography>
      <Form
        form={props.categoryForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.categoryFormSubmitHandler}
        btnName="add category"
        btnColor="secondary"
      />
    </Box>
  );
};

export default Categories;
