import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const CategoryList = (props) => {
  const classes = useStyles();

  let categoryList = <p>Loading...</p>;

  if (props.categoryList.length > 0)
    categoryList = props.categoryList.map((category) => {
      return (
        <ListItem key={category.id}>
          <Grid item className={classes.root}>
            <Box pr={2}>
              <Typography color="textSecondary" variant="body1" align="left">
                {category.Name}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="body1" align="right">
              {category.Balance} ILS
            </Typography>
          </Grid>
          <IconButton onClick={() => props.deleteCategory(category.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
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
