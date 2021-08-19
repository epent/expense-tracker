import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import ExpenseForm from "../Expenses/ExpenseForm";
import IncomeForm from "../Income/IncomeForm";
import TransferForm from "../Transfers/TransferForm";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
  modal: {
    width: 420,
  },
});

const History = (props) => {
  const classes = useStyles();

  let transactions = <p>Loading...</p>;

  if (props.transactions.length > 0)
    transactions = props.transactions.map((transaction) => {
      const [weekday, month, day, year] = transaction.Date.split(" ");

      return (
        <Box key={transaction.id}>
          <Grid item xs={12} className={classes.root}>
            <ListItem>
              <Grid item xs={2}>
                <Typography color="textSecondary" variant="body1">
                  {`${day} ${month}`}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography
                  color={props.transactionColor}
                  variant="body1"
                >{`${transaction.From}`}</Typography>
              </Grid>
              <Grid item xs={1}>
                <ArrowRightAltIcon color={props.arrowColor} />
              </Grid>
              <Grid item xs={2}>
                <Typography
                  color={props.transactionColor}
                  variant="body1"
                >{`${transaction.To}`}</Typography>
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
                <IconButton onClick={() => props.openModal(transaction)}>
                  <DeleteIcon />
                </IconButton>
                {props.transactionToDelete && (
                  <Dialog open={props.showModal} onClose={props.closeModal}>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete this transaction?
                      </DialogContentText>
                      <ListItem className={classes.modal}>
                        <Grid item xs={2}>
                          <Typography color="textSecondary" variant="body1">
                            {`${props.transactionToDelete.Date.split(" ")[2]} ${
                              props.transactionToDelete.Date.split(" ")[1]
                            }`}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            color={props.transactionColor}
                            variant="body1"
                          >{`${props.transactionToDelete.From}`}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <ArrowRightAltIcon color={props.arrowColor} />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            color={props.transactionColor}
                            variant="body1"
                          >{`${props.transactionToDelete.To}`}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            color={props.amountColor}
                            variant="body1"
                            align="right"
                          >{`${props.sign}${props.transactionToDelete.Amount} ILS`}</Typography>
                        </Grid>
                      </ListItem>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" onClick={props.closeModal}>
                        Close
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() =>
                          props.deleteTransaction(
                            props.transactionToDelete.id,
                            props.transactionToDelete.Amount,
                            props.transactionToDelete.From,
                            props.transactionToDelete.To
                          )
                        }
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Grid>
            </ListItem>
            <Typography color="textSecondary" variant="body2">
              {transaction.Comment}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {props.showExpenseForm &&
              transaction.id === props.editedExpenseId && (
                <ExpenseForm
                  editedExpenseForm={props.expenseForm}
                  showEditedForm={props.showExpenseForm}
                  editedExpenseId={props.editedExpenseId}
                  setShowExpenseForm={props.setShowExpenseForm}
                  updateExpenseLog={props.updateExpenseLog}
                  updateHomeHandler={props.updateHomeHandler}
                />
              )}
          </Grid>
          <Grid item xs={12}>
            {props.showIncomeForm &&
              transaction.id === props.editedIncomeId && (
                <IncomeForm
                  editedIncomeForm={props.incomeForm}
                  showEditedForm={props.showIncomeForm}
                  editedIncomeId={props.editedIncomeId}
                  setShowIncomeForm={props.setShowIncomeForm}
                  updateIncomeLog={props.updateIncomeLog}
                  updateHomeHandler={props.updateHomeHandler}
                />
              )}
          </Grid>
          <Grid item xs={12}>
            {props.showTransferForm &&
              transaction.id === props.editedTransferId && (
                <TransferForm
                  editedTransferForm={props.transferForm}
                  showEditedForm={props.showTransferForm}
                  editedTransferId={props.editedTransferId}
                  setShowTransferForm={props.setShowTransferForm}
                  updateTransferLog={props.updateTransferLog}
                  updateHomeHandler={props.updateHomeHandler}
                />
              )}
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
