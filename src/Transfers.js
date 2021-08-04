import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Forms/Form";
import History from "./History/History";

const Transfers = (props) => {
  const [transferLog, setTransferLog] = useState({
    transferList: [],
    loading: true,
  });

  useEffect(() => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const fetchedList = [];
        for (let key in data) {
          fetchedList.push({
            ...data[key],
            id: key,
          });
        }

        setTransferLog({
          ...transferLog,
          transferList: fetchedList,
          loading: false,
        });
      });
  }, []);

  const updateFormHandler = (event, formKey) => {
    props.setTransferForm({
      ...props.transferForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom color="textSecondary">
        Transfer
      </Typography>
      <Form
        form={props.transferForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.transferFormSubmitHandler}
        btnName="add transfer"
        btnColor="primary"
      />
      <History
        transactions={transferLog.transferList}
        transactionColor="textSecondary"
        amountColor="textSecondary"
        sign=""
      />
    </Box>
  );
};

export default Transfers;
