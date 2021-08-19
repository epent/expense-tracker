import React from "react";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const Balance = (props) => {
  return (
    <Box>
      <Paper elevation={3}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          {`Total ${props.title}`}
        </Typography>
        <Typography variant="h5" gutterBottom color={props.amountColor}>
          {`${props.amount} ILS`}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Balance;
