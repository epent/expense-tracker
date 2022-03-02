import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";

const CategorieList = (props) => {
  // const deleteCategoryHandler = (categoryId) => {
  //   deleteCategoryFromDB("categories", categoryId);

  //   const updateCategoryLog = () => {
  //     const updatedCategoryLog = categoryLog.filter(
  //       (category) => category.id !== categoryId
  //     );
  //     setCategoryLog(updatedCategoryLog);
  //   };
  //   updateCategoryLog();
  // };

  // const editCategoryHandler = (category) => {
  //   setCategoryForm({
  //     Name: category.Name,
  //     Balance: category.Balance,
  //   });

  //   setEditedCategoryId(category.id);

  //   if (editedCategoryId === category.id) {
  //     setShowCategoryForm((prevState) => !prevState);
  //   }
  // };

  // const deleteButton = (
  //   <IconButton aria-label="delete" size="small">
  //     <DeleteIcon />
  //   </IconButton>
  // );

  // const editButton = (
  //   <IconButton aria-label="delete" size="small">
  //     <EditIcon />
  //   </IconButton>
  // );

  let categorieList = (
    <Typography variant="subtitle2">
      Please add first{" "}
      <Link href="/categories" color="secondary">
        category
      </Link>
    </Typography>
  );
  if (props.categorieList && props.categorieList.length > 0) {
    categorieList = props.categorieList.map((category) => {
      return (
        <Grid item key={category.name}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle2">{category.name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">{category.balance}</Typography>
            </Grid>
          </Grid>
          <Box my={1}>
            <Divider />
          </Box>
        </Grid>
      );
    });
  }

  return (
    <Box>
      <Box mx={5} my={2}>
        <Grid container direction="column" spacing={1}>
          {categorieList}
        </Grid>
      </Box>
    </Box>
  );
};

export default CategorieList;
