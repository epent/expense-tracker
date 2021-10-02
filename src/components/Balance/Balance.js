import React from "react";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 485,
    height: 155,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const Balance = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Paper elevation={3} className={classes.root}>
        <Box p={1}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            {`Total ${props.title}`}
          </Typography>
          <Typography variant="h5" gutterBottom color={props.amountColor}>
            {`${props.amount} ILS`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Balance;
