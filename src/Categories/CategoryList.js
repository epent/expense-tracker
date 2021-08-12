import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import CategoryForm from "./CategoryForm";

const useStyles = makeStyles({
  root: {
    width: 150,
  },
});

const CategoryList = (props) => {
  const classes = useStyles();

  let categoryList = <p>Loading...</p>;

  if (props.categoryList.length > 0)
    categoryList = props.categoryList.map((category) => {
      return (
        <Box key={category.id}>
          <Grid item xs={12}>
            <ListItem>
              <Grid item className={classes.root} xs={6}>
                <Typography color="textSecondary" variant="body1" align="left">
                  {category.Name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" variant="body2" align="right">
                  {category.Balance} ILS
                </Typography>
              </Grid>
              {props.showEditBtn && (
                <IconButton
                  onClick={() =>
                    props.editCategory(
                      category.id,
                      category.Name,
                      category.Balance
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              )}
              {props.showDeleteBtn && (
                <IconButton onClick={() => props.deleteCategory(category.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          </Grid>
          <Grid item xs={12}>
            {props.showCategoryForm &&
              category.id === props.editedCategoryId && (
                <CategoryForm
                  editedCategoryForm={props.categoryForm}
                  showEditedForm={props.showCategoryForm}
                  editedCategoryId={props.editedCategoryId}
                  setShowCategoryForm={props.setShowCategoryForm}
                />
              )}
          </Grid>
        </Box>
      );
    });

  return (
    <Box mt={3}>
      <Grid container spacing={2}>
        <List>{categoryList}</List>
      </Grid>
    </Box>
  );
};

export default CategoryList;
