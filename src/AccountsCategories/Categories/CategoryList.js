import React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
// import IconButton from "@material-ui/core/IconButton";
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";

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

  let categorieList = <p>Loading...</p>;
  if (props.categorieList && props.categorieList.length > 0) {
    categorieList = props.categorieList.map((category) => {
      return (
        <Grid item key={category.id}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle2">{category.Name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2">{category.Balance}</Typography>
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
