import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import HistoryLog from "../History/HistoryLog";
import AccountLog from "../Accounts/AccountLog";
import CategoryLog from "../Categories/CategoryLog";

import Box from "@material-ui/core/Box";

const Home = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <AccountLog />
      </Grid>
      <Grid item xs={5}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Categories
        </Typography>
        <CategoryLog />
      </Grid>
      <Grid item xs={7}>
        <HistoryLog />
      </Grid>
    </Grid>
  );
};

export default Home;
