import React from "react";

import Box from "@material-ui/core/Box";

import AccountForm from "../Accounts/AccountForm";
import AccountLog from "../Accounts/AccountLog";

const Accounts = () => {
  return (
    <Box>
      <AccountLog />
      <AccountForm />
    </Box>
  );
};

export default Accounts;
