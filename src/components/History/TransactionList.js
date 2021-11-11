import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";

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
    { field: "date", headerName: "Date", type: "date", flex: 1 },
    { field: "from", headerName: "From", flex: 1 },
    { field: "to", headerName: "To", flex: 1 },
    { field: "amount", headerName: "Amount", type: "number", flex: 1 },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const expenses = await getDataFromDB("expenses");
      const income = await getDataFromDB("income");
      const transfers = await getDataFromDB("transfers");

      const expenseList = pushFetchedDataToList(expenses, "expenses");
      const incomeList = pushFetchedDataToList(income, "income");
      const transferList = pushFetchedDataToList(transfers, "transfers");

      const updateRowList = async () => {
        const transactionList = [
          ...expenseList,
          ...incomeList,
          ...transferList,
        ];
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
            amount: `${sign}${transaction.Amount} ILS`,
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
      <DeleteIcon
        onClick={() => {
          props.deleteRowsHandler(selectionModel, fullList);
        }}
      />
    </IconButton>
  );

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Paper elevation={3} className={classes.paper}>
            <Box p={3}>
              <Typography variant="h5" color="textSecondary">
                Recent transactions
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
              />
              {props.showDeleteButton && deleteButton}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionList;
