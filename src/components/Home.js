import React from "react";

import Expenses from "./Expenses";
import Income from "./Income";
import Transfers from "./Transfers";
import HistoryLog from "../History/HistoryLog";
import Accounts from "./Accounts";

import Box from "@material-ui/core/Box";

const Home = (props) => {
  return (
    <Box>
      <Accounts />
      {/* <Expenses
        expenseForm={props.expenseForm}
        expenseFormSubmitHandler={props.expenseFormSubmitHandler}
        setExpenseForm={props.setExpenseForm}
      />
      <Income
        incomeForm={props.incomeForm}
        inputFormSubmitHandler={props.inputFormSubmitHandler}
        setIncomeForm={props.setIncomeForm}
      />
      <Transfers
        transferForm={props.transferForm}
        transferFormSubmitHandler={props.transferFormSubmitHandler}
        setTransferForm={props.setTransferForm}
      /> */}
      <HistoryLog />
    </Box>
  );
};

export default Home;
