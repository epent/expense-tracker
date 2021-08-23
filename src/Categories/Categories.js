import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import CategoryForm from "../Categories/CategoryForm";
import CategoryLog from "../Categories/CategoryLog";

const Categories = (props) => {
  const [categoryFormShow, setCategoryFormShow] = useState(false);

  const [updatedCategoryLog, setUpdatedCategoryLog] = useState(false);

  // show the form when toggle "+Categories" button
  const showCategoryFormHandler = () => {
    setCategoryFormShow((prevState) => !prevState);
  };

  // update the list of categories
  const updateCategoryLogHandler = () => {
    setUpdatedCategoryLog((prevState) => !prevState);
  };

  const categoryForm = (
    <Box mt={3}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddBoxIcon />}
            onClick={showCategoryFormHandler}
          >
            Categories
          </Button>
        </Grid>
        <Grid item xs={12}>
          {categoryFormShow && (
            <CategoryForm updateCategoryLog={updateCategoryLogHandler} />
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid container>
      {props.showCategoryForm && categoryForm}
      <Grid item xs={12}>
        <CategoryLog
          sliceLog={props.sliceLog}
          showEditBtn={props.showEditBtn}
          showDeleteBtn={props.showDeleteBtn}
          updatedCategoryLog={updatedCategoryLog}
          updateCategoryLog={updateCategoryLogHandler}
          updateHome={props.updateHome}
        />
      </Grid>
    </Grid>
  );
};

export default Categories;
