import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import CategoryForm from "../Categories/CategoryForm";
import CategoryLog from "../Categories/CategoryLog";

const Categories = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom color="secondary">
        Categories
      </Typography>
      <CategoryForm />
      <CategoryLog />
    </Box>
  );
};

export default Categories;
