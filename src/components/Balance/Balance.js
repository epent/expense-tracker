import React from "react";

import NumberFormat from "react-number-format";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
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

  let prefix;
  if (props.sign) {
    prefix = "+";
  }

  return (
    <Grid>
      <Paper elevation={3} className={classes.root}>
        <Box>
          <Box pt={3}>
            <Typography
              variant="h3"
              gutterBottom
              color={props.amountColor}
              align="center"
            >
              <NumberFormat
                value={props.amount}
                displayType={"text"}
                thousandSeparator={true}
                suffix={" ILS"}
                prefix={prefix}
              />
            </Typography>
          </Box>
          <Typography
            variant="h5"
            gutterBottom
            color="textSecondary"
            align="center"
          >
            {`Total ${props.title}`}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Balance;
