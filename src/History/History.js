import React from "react";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 530,
  },
});

const History = (props) => {
  const classes = useStyles();

  let transactions = <p>Loading...</p>;

  if (props.transactions.length > 0)
    transactions = props.transactions.map((transaction) => {
      return (
        <Box key={transaction.id}>
          <Grid item xs={12} className={classes.root}>
            <ListItem>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="body1">
                  {transaction.Date}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  color={props.transactionColor}
                  variant="body1"
                >{`${transaction.From} --> ${transaction.To}`}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  color={props.amountColor}
                  variant="body1"
                  align="right"
                >{`${props.sign}${transaction.Amount} ILS`}</Typography>
              </Grid>
              <Grid item xs={1} align="right">
                <IconButton
                  onClick={() =>
                    props.editTransaction(
                      transaction.id,
                      transaction.From,
                      transaction.To,
                      transaction.Amount,
                      transaction.Date,
                      transaction.Comment
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid item xs={1} align="right">
                <IconButton
                  onClick={() =>
                    props.deleteTransaction(
                      transaction.id,
                      transaction.Amount,
                      transaction.From,
                      transaction.To
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </ListItem>
            <Typography color="textSecondary" variant="body2">
              {transaction.Comment}
            </Typography>
          </Grid>
        </Box>
      );
    });

  return (
    <Grid container spacing={2}>
      <List>{transactions}</List>
    </Grid>
  );
};

export default History;
