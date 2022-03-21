import React, { useState, useEffect, useCallback } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";

import { getData } from "../modules/fetch";

const TransactionList = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
  }));

  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);

  const [toDelete, setToDelete] = useState("");

  const [fullList, setFullList] = useState([]);

  const [selectionModel, setSelectionModel] = useState([]);

  const [editRowsModel, setEditRowsModel] = useState({});

  const handleEditRowsModelChange = useCallback((model) => {
    setEditRowsModel(model);
  }, []);

  const handleRowUpdate = () => {
    const oldRow = fullList.filter((transaction) => {
      return transaction.id === Object.keys(editRowsModel)[0];
    });

    const newRow = Object.keys(editRowsModel).map((key) => {
      return {
        id: key,
        from: editRowsModel[key].from.value,
        to: editRowsModel[key].to.value,
        amount: Math.abs(editRowsModel[key].amount.value),
        date: Date(editRowsModel[key].date.value),
      };
    });

    props.editRowsHandler(newRow[0], oldRow[0]);
    setSelectionModel("");
  };

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: "date",
      flex: 1,
      editable: props.allowEditing ? true : false,
    },
    {
      field: "from",
      headerName: "From",
      flex: 1,
      editable: props.allowEditing ? true : false,
    },
    {
      field: "to",
      headerName: "To",
      flex: 1,
      editable: props.allowEditing ? true : false,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 1,
      editable: props.allowEditing ? true : false,
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const addType = (transactions, type) => {
        const updatedTransactions = transactions.map((transaction) => {
          return type === "expenses"
            ? {
                ...transaction,
                type: type,
                from: transaction.accountName,
                to: transaction.categoryName,
              }
            : type === "incomes"
            ? {
                ...transaction,
                type: type,
                from: transaction.from,
                to: transaction.accountName,
              }
            : {
                ...transaction,
                type: type,
                from: transaction.accountFromName,
                to: transaction.accountToName,
              };
        });
        return updatedTransactions;
      };

      const expenses = await getData("expenses", props.token);
      const expensesWithType = addType(expenses, "expenses");
      const incomes = await getData("incomes", props.token);
      const incomesWithType = addType(incomes, "incomes");
      const transfers = await getData("transfers", props.token);
      const transfersWithType = addType(transfers, "transfers");

      const updateRowList = async () => {
        let transactionList;
        props.onlyExpenses
          ? (transactionList = [...expensesWithType])
          : props.onlyIncome
          ? (transactionList = [...incomesWithType])
          : props.onlyTransfers
          ? (transactionList = [...transfersWithType])
          : (transactionList = [
              ...expensesWithType,
              ...incomesWithType,
              ...transfersWithType,
            ]);

        setFullList(transactionList);

        const rowList = [];

        transactionList.map((transaction) => {
          const withoutTime = transaction.date.toString().slice(0, 10);
          const [year, month, day] = withoutTime.split("-");

          let sign;
          transaction.type === "expenses"
            ? (sign = "-")
            : transaction.type === "incomes"
            ? (sign = "+")
            : (sign = "");

          return rowList.push({
            id: transaction.id,
            date: `${day}/${month}/${year}`,
            from: transaction.from,
            to: transaction.to,
            amount: `${sign}${transaction.amount}`,
          });
        });

        setRows(rowList);
      };
      await updateRowList();
    };
    if (props.token) {
      fetchTransactions();
    }
  }, [
    props.updateHome,
    props.updateExpenses,
    props.updateIncome,
    props.updateTransfers,
    props.onlyExpenses,
    props.onlyIncome,
    props.onlyTransfers,
    props.token,
  ]);

  const openModalHandler = (transactionId, transactionList) => {
    const transactionToDelete = transactionList.filter((transaction) => {
      return transaction.id === transactionId[0];
    });

    setShowModal(true);

    setToDelete(transactionToDelete[0]);
  };

  const deleteButton = (
    <IconButton
      aria-label="delete"
      size="large"
      onClick={() => openModalHandler(selectionModel, fullList)}
    >
      <DeleteIcon />
    </IconButton>
  );

  let transactionToDelete;
  if (toDelete) {
    const fullDate = new Date(toDelete.date);
    const [, month, day, year] = fullDate.toString().split(" ");

    transactionToDelete = (
      <ListItem>
        <Grid item xs={2}>
          <Typography color="textSecondary" variant="body1">
            {`${day} ${month} ${year}`}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">{`${toDelete.from}`}</Typography>
        </Grid>
        <Grid item xs={1}>
          <ArrowRightAltIcon color={props.arrowColor} />
        </Grid>
        <Grid item xs={2}>
          <Typography
            color={props.transactionColor}
            variant="body1"
          >{`${toDelete.to}`}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            color={props.amountColor}
            variant="body1"
            align="right"
          >{`${props.sign}${toDelete.amount} ILS`}</Typography>
        </Grid>
      </ListItem>
    );
  }

  const deleteModal = (
    <Dialog open={showModal} onClose={() => setShowModal(false)}>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this transaction?
        </DialogContentText>
        {transactionToDelete}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setShowModal(false);
            props.deleteTransaction(toDelete);
          }}
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
          <Box>
            <DataGrid
              autoHeight={true}
              rowHeight={49}
              columns={columns}
              rows={rows}
              pageSize={props.pageSize}
              rowsPerPageOptions={[5, 7, 14]}
              disableSelectionOnClick={props.allowEditing ? false : true}
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
            {toDelete && deleteModal}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TransactionList;
