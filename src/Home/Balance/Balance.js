import React from "react";
import Link from "@material-ui/core/Link";

import NumberFormat from "react-number-format";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: theme.spacing(2),
    textAlign: "center",
  },
}));

const Balance = (props) => {
  const classes = useStyles();

  let prefix;
  if (props.sign) {
    prefix = "+";
  }

  return (
    <Box>
      <Link href={props.route} color={props.amountColor}>
        <Paper className={classes.paper}>
          <Box>
            <Typography
              variant="h4"
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
            variant="h6"
            gutterBottom
            color="textSecondary"
            align="center"
          >
            {`Total ${props.title}`}
          </Typography>
        </Paper>
      </Link>
    </Box>
  );
};

export default Balance;
