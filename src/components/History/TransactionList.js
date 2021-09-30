import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";

import { getDataFromDB, pushFetchedDataToList } from "../../modules/fetch";

const useStyles = makeStyles({
  root: {
    width: 780,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const TransactionList = (props) => {
  const classes = useStyles();

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
    { field: "date", headerName: "Date", type: "date", width: 200 },
    { field: "from", headerName: "From", width: 200 },
    { field: "to", headerName: "To", width: 200 },
    { field: "amount", headerName: "Amount", type: "number", width: 175 },
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
  }, [props.updateHome]);

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Recent transactions
          </Typography>
        </Box>
        <Box style={{ width: 780 }}>
          <DataGrid
            autoHeight={true}
            rowHeight={45}
            columns={columns}
            rows={rows}
            pageSize={15}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

export default TransactionList;
