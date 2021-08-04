import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";

import Form from "./Forms/Form";

const useStyles = makeStyles({
  root: {
    width: 400,
  },
});

const Categories = (props) => {
  const classes = useStyles();

  const [categoryLog, setCategoryLog] = useState({
    categoryList: [],
    loading: true,
  });

  useEffect(() => {
    // fetch categoryList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedCategoryList = [];
        for (let key in data) {
          fetchedCategoryList.push({
            ...data[key],
            id: key,
          });
        }

        setCategoryLog({
          ...categoryLog,
          categoryList: fetchedCategoryList,
          loading: false,
        });

        console.log(fetchedCategoryList);
      });
  }, []);

  const updateFormHandler = (event, formKey) => {
    props.setCategoryForm({
      ...props.categoryForm,
      [formKey]: event.target.value,
    });
  };

  let categoryList = <p>Loading...</p>;

  if (!categoryLog.loading)
    categoryList = categoryLog.categoryList.map((category) => {
      return (
        <ListItem key={category.id}>
          <Grid item className={classes.root}>
            <Box pr={2}>
              <Typography color="textSecondary" variant="h6" align="left">
                {category.Name}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="h6" align="right">
              {category.Balance} ILS
            </Typography>
          </Grid>
        </ListItem>
      );
    });

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
      <Box mt={8}>
        <Grid container spacing={2}>
          <List>{categoryList}</List>
        </Grid>
      </Box>
    </Box>
  );
};

export default Categories;
