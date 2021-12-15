import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import CategoryList from "./CategoryList";
import CategoriesDonut from "../Charts/Donut/CategoriesDonut";
import { getDataFromDBasList as getCategoriesFromDB } from "../modules/fetch";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    [theme.breakpoints.up("md")]: {
      height: 345,
    },
  },
}));

const CategoriePaper = (props) => {
  const classes = useStyles();

  const [categorieList, setCategorieList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategorieList = await getCategoriesFromDB("categories");

      setCategorieList(fetchedCategorieList);
      console.log(fetchedCategorieList);
    };
    fetchCategories();
  }, [props.updateCategories, props.updateHome]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Box p={3}>
            <Typography variant="h5" color="textSecondary">
              {props.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={5}>
          <CategoriesDonut
            updateCategories={props.updateCategories}
            updateHome={props.updateHome}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={7}>
          <CategoryList
            categorieList={categorieList}
            sliceLog={props.sliceLog}
            showEditBtn={props.showEditBtn}
            showDeleteBtn={props.showDeleteBtn}
            title={props.title}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CategoriePaper;
