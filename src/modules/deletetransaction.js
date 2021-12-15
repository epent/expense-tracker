export const increaseBalance = (dataList, transactionToDelete) => {
  const account = dataList.filter(
    (account) => account.Name === transactionToDelete.From
  );
  const updatedAccount = {
    Balance: Number(account[0].Balance) + Number(transactionToDelete.Amount),
  };
  const accountId = account[0].id;

  return [updatedAccount, accountId];
};

export const decreaseBalance = (dataList, transactionToDelete) => {
  const category = dataList.filter(
    (category) => category.Name === transactionToDelete.To
  );
  const updatedCategory = {
    Balance: Number(category[0].Balance) - Number(transactionToDelete.Amount),
  };
  const categoryId = category[0].id;

  return [updatedCategory, categoryId];
};
