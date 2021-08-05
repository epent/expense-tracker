import React from "react";

import Typography from "@material-ui/core/Typography";

import HistoryLog from "../History/HistoryLog";
import AccountLog from "../Accounts/AccountLog";
import CategoryLog from "../Categories/CategoryLog";

import Box from "@material-ui/core/Box";

const Home = (props) => {
  return (
    <Box>
      <AccountLog />
      <Typography variant="h3" gutterBottom color="textSecondary">
        Categories
      </Typography>
      <CategoryLog />
      <HistoryLog />
    </Box>
  );
};

export default Home;
