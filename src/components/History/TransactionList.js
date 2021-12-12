import React, { useState, useEffect, useCallback, useRef } from "react";

import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@mui/x-data-grid";

import { getDataFromDB, pushFetchedDataToList } from "../../modules/fetch";

const TransactionList = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
    dataGrid: {},
  }));
  const classes = useStyles();

  const [fullList, setFullList] = useState([]);

  const [selectionModel, setSelectionModel] = useState([]);

  const [editRowsModel, setEditRowsModel] = useState({});

  const handleEditRowsModelChange = useCallback((model) => {
    setEditRowsModel(model);
  }, []);

  const handleRowUpdate = () => {
    console.log(fullList);
    const key = Object.keys(editRowsModel).map((key) => {
      return key;
    });

    const oldRow = fullList.filter((transaction) => {
      return transaction.id === key[0];
    });

    props.editRowsHandler(editRowsModel, oldRow[0]);
  };

  const [rows, setRows] = useState([
    {
      id: "",
      date: "",
      from: "",
      to: "",
      amount: "",
    },
  ]);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      flex: 1,
      editable: true,
    },
    { field: "from", headerName: "From", flex: 1, editable: true },
    { field: "to", headerName: "To", flex: 1, editable: true },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 1,
      editable: true,
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const expenses = await getDataFromDB("expenses");
      const income = await getDataFromDB("income");
      const transfers = await getDataFromDB("transfers");

      const expenseList = pushFetchedDataToList(expenses, "expenses");
      console.log(expenseList);
      const incomeList = pushFetchedDataToList(income, "income");
      const transferList = pushFetchedDataToList(transfers, "transfers");

      const updateRowList = async () => {
        let transactionList;
        props.onlyExpenses
          ? (transactionList = [...expenseList])
          : props.onlyIncome
          ? (transactionList = [...incomeList])
          : props.onlyTransfers
          ? (transactionList = [...transferList])
          : (transactionList = [
              ...expenseList,
              ...incomeList,
              ...transferList,
            ]);

        setFullList(transactionList);

        const rowList = [];

        transactionList.map((transaction) => {
          const [weekday, month, day, year] = transaction.Date.split(" ");

          let sign;
          transaction.type === "expenses"
            ? (sign = "-")
            : transaction.type === "income"
            ? (sign = "+")
            : (sign = "");

          rowList.push({
            id: transaction.id,
            date: new Date(`${day} ${month} ${year}`),
            from: transaction.From,
            to: transaction.To,
            amount: `${sign}${transaction.Amount}`,
          });
        });

        setRows(rowList);
      };
      await updateRowList();
    };
    fetchTransactions();
  }, [
    props.updateHome,
    props.updateExpenses,
    props.updateIncome,
    props.updateTransfers,
  ]);

  const deleteButton = (
    <IconButton aria-label="delete">
      <DeleteIcon onClick={() => props.openModal(selectionModel, fullList)} />
    </IconButton>
  );

  let listOfTransactionsToDelete;
  if (props.transactionsToDelete)
    listOfTransactionsToDelete = props.transactionsToDelete.map(
      (transactionToDelete) => {
        return (
          <ListItem className={classes.modal}>
            <Grid item xs={2}>
              <Typography color="textSecondary" variant="body1">
                {`${transactionToDelete.Date.split(" ")[2]} ${
                  transactionToDelete.Date.split(" ")[1]
                }`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                color={props.transactionColor}
                variant="body1"
              >{`${transactionToDelete.From}`}</Typography>
            </Grid>
            <Grid item xs={1}>
              <ArrowRightAltIcon color={props.arrowColor} />
            </Grid>
            <Grid item xs={2}>
              <Typography
                color={props.transactionColor}
                variant="body1"
              >{`${transactionToDelete.To}`}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                color={props.amountColor}
                variant="body1"
                align="right"
              >{`${props.sign}${transactionToDelete.Amount} ILS`}</Typography>
            </Grid>
          </ListItem>
        );
      }
    );

  const deleteModal = (
    <Dialog open={props.showModal} onClose={props.closeModal}>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete these transactions?
        </DialogContentText>
        {listOfTransactionsToDelete}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.closeModal}>
          Close
        </Button>
        <Button
          color="secondary"
          onClick={() => props.deleteTransaction(props.transactionsToDelete)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Paper elevation={3} className={classes.paper}>
          <Box p={3}>
            <Typography variant="h5" color="textSecondary">
              {props.pageTitle}
            </Typography>
          </Box>
          <Box className={classes.dataGrid}>
            <DataGrid
              autoHeight={true}
              rowHeight={49}
              columns={columns}
              rows={rows}
              pageSize={props.pageSize}
              checkboxSelection
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              selectionModel={selectionModel}
              editMode="row"
              editRowsModel={editRowsModel}
              onEditRowsModelChange={handleEditRowsModelChange}
              onRowEditStop={handleRowUpdate}
            />
            {props.showDeleteButton && deleteButton}
            {props.transactionsToDelete && deleteModal}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TransactionList;
