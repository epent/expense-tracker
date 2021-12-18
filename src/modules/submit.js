export const updateAccountBalance = async (
  fetchedAccountList,
  form,
  typeOfTransaction,
  fromOrTo
) => {
  if (typeOfTransaction === "expense") {
    const account = fetchedAccountList.filter(
      (account) => account.Name === form.From
    );
    const updatedAccount = {
      Balance: Number(account[0].Balance) - Number(form.Amount),
    };
    const accountId = account[0].id;

    return [updatedAccount, accountId];
  }

  if (typeOfTransaction === "income") {
    const account = fetchedAccountList.filter(
      (account) => account.Name === form.To
    );
    const updatedAccount = {
      Balance: Number(account[0].Balance) + Number(form.Amount),
    };
    const accountId = account[0].id;

    return [updatedAccount, accountId];
  }

  if (typeOfTransaction === "transfer") {
    let accountName;
    fromOrTo === "From" ? (accountName = form.From) : (accountName = form.To);

    const account = fetchedAccountList.filter(
      (account) => account.Name === accountName
    );

    let updatedAccount;
    fromOrTo === "From"
      ? (updatedAccount = {
          Balance: Number(account[0].Balance) - Number(form.Amount),
        })
      : (updatedAccount = {
          Balance: Number(account[0].Balance) + Number(form.Amount),
        });
    const accountId = account[0].id;

    return [updatedAccount, accountId];
  }
};

export const updateCategoryBalance = async (fetchedCategoryList, form) => {
  const category = fetchedCategoryList.filter(
    (category) => category.Name === form.To
  );
  const updatedCategory = {
    Balance: Number(category[0].Balance) + Number(form.Amount),
  };
  const categoryId = category[0].id;

  return [updatedCategory, categoryId];
};

export const updateTotalBalance = async (
  fetchedTotalList,
  form,
  typeOfTransaction
) => {
  const expensesORincome = fetchedTotalList.filter((total) => {
    return total.id === typeOfTransaction;
  });

  const balance = fetchedTotalList.filter((total) => {
    return total.id === "balance";
  });

  const updatedTotals = {
    [typeOfTransaction]:
      Number(expensesORincome[0][typeOfTransaction]) + Number(form.Amount),
    balance: Number(balance[0]["balance"]) - Number(form.Amount),
  };

  return updatedTotals;
};
