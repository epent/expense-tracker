import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import NewCategorieForm from "./NewCategorieForm";
import CategoriePaper from "./CategoriePaper";

const NewCategories = (props) => {
  const [updateCategories, setUpdateCategories] = useState(false);

  // update the list of categories
  const updateCategoriesHandler = () => {
    setUpdateCategories((prevState) => !prevState);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <NewCategorieForm
          pageTitle="Add new categorie"
          updateCategoriesHandler={updateCategoriesHandler}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CategoriePaper
          updateCategories={updateCategories}
          title="List of categories"
        />
      </Grid>
    </Grid>
  );
};

export default NewCategories;
