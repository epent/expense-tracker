import React from "react";
import Link from "@mui/material/Link";

import NumberFormat from "react-number-format";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

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
