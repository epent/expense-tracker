import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { makeStyles } from "@material-ui/core/styles";

import CategoryForm from "../Categories/CategoryForm";
import CategoryLog from "../Categories/CategoryLog";
import Donut from "../Charts/Donut";
import { fetchCategoriesFromDB } from "../modules/fetch";

const useStyles = makeStyles({
  root: {
    width: 680,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const Categories = (props) => {
  const classes = useStyles();

  const [categoryFormShow, setCategoryFormShow] = useState(false);

  const [updatedCategoryLog, setUpdatedCategoryLog] = useState(false);

  const [categoryBalances, setCategoryBalances] = useState([]);

  const [categoryLabels, setCategoryLabels] = useState([]);

  const [updateDonut, setUpdateDonut] = useState(false);

  useEffect(() => {
    const updateCategories = async () => {
      const fetchCategories = async () => {
        const categoryList = await fetchCategoriesFromDB();

        const updateState = async () => {
          const fetchedCategoryBalances = categoryList.map((category) => {
            return Number(category.Balance);
          });

          const fetchedCategoryLabels = categoryList.map((category) => {
            return category.Name;
          });

          setCategoryBalances(fetchedCategoryBalances);

          setCategoryLabels(fetchedCategoryLabels);

          setUpdateDonut((prevState) => !prevState);
        };
        await updateState();
      };
      await fetchCategories();
    };
    updateCategories();
  }, [updatedCategoryLog, props.updateHome]);

  // show the form when toggle "+Categories" button
  const showCategoryFormHandler = () => {
    setCategoryFormShow((prevState) => !prevState);
  };

  // update the list of categories
  const updateCategoryLogHandler = () => {
    setUpdatedCategoryLog((prevState) => !prevState);
  };

  const categoryForm = (
    <Box>
      <Grid item xs={12}>
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
          {categoryFormShow && (
            <CategoryForm updateCategoryLog={updateCategoryLogHandler} />
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid container>
      {props.showCategoryForm && categoryForm}
      <Paper elevation={3} className={classes.root}>
        <Grid container direction="row" item xs={12}>
          <Grid item xs={6}>
            <Box mt={3} mx={3}>
              <Typography variant="h5" gutterBottom color="textSecondary">
                Categories
              </Typography>
            </Box>
            <Box px={3}>
              <CategoryLog
                sliceLog={props.sliceLog}
                showEditBtn={props.showEditBtn}
                showDeleteBtn={props.showDeleteBtn}
                updatedCategoryLog={updatedCategoryLog}
                updateCategoryLog={updateCategoryLogHandler}
                updateHome={props.updateHome}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box mt={2}>
              <Donut
                labels={[]}
                data={[]}
                updatedLabels={categoryLabels}
                updatedData={categoryBalances}
                updateDonut={updateDonut}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Categories;
