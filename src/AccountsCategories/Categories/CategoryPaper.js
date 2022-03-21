import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import CategoryList from "./CategoryList";
import CategoriesDonut from "../../Charts/Donut/CategoriesDonut";
import { getData as getCategories } from "../../modules/fetch";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    [theme.breakpoints.up("md")]: {
      height: 400,
    },
  },
}));

const CategoriePaper = (props) => {
  const classes = useStyles();

  const [categorieList, setCategorieList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories("categories", props.token);

      setCategorieList(categories);
    };
    fetchCategories();
  }, [props.updateCategories, props.updateHome, props.token]);

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
          <CategoriesDonut categorieList={categorieList} />
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
