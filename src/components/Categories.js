import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import CategoryForm from "../Categories/CategoryForm";
import CategoryLog from "../Categories/CategoryLog";

const Categories = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const showCategoryFormHandler = () => {
    setShowCategoryForm((prevState) => !prevState);
  };

  return (
    <Grid container>
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
        {showCategoryForm && <CategoryForm />}
      </Grid>
      <Grid item xs={12}>
        <CategoryLog showEditBtn={true} showDeleteBtn={true} />
      </Grid>
    </Grid>
  );
};

export default Categories;
