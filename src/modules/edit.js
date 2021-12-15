export const editTransaction = (row, type) => {
  let id;
  let form;

  Object.keys(row).map((key) => {
    id = key;
    let amount;

    if (type === "expenses") {
      let amountString = row[key].amount.value;
      console.log(typeof amountString);
      console.log(amountString);
      let amountArray = amountString.toString().split("");
      amountArray.shift();
      amount = amountArray.join("");
    } else {
      amount = row[key].amount.value;
    }

    form = {
      Amount: amount,
      From: row[key].from.value,
      To: row[key].to.value,
      Date: row[key].date.value.toDateString(),
    };
  });

  return [id, form];
};

export const updateAmountFrom = (fromList, oldData, newData) => {
  const account = fromList.filter((account) => account.Name === oldData.From);

  let updatedFrom;
  let idFrom;

  if (oldData.Amount > newData.Amount) {
    updatedFrom = {
      Balance:
        Number(account[0].Balance) +
        (Number(oldData.Amount) - Number(newData.Amount)),
    };
    idFrom = account[0].id;
  }

  if (oldData.Amount < newData.Amount) {
    updatedFrom = {
      Balance:
        Number(account[0].Balance) -
        (Number(newData.Amount) - Number(oldData.Amount)),
    };
    idFrom = account[0].id;
  }

  return [updatedFrom, idFrom];
};

export const updateAmountTo = (toList, oldData, newData) => {
  const category = toList.filter((category) => category.Name === oldData.To);
  let updatedTo;
  let idTo;

  if (oldData.Amount > newData.Amount) {
    updatedTo = {
      Balance:
        Number(category[0].Balance) -
        (Number(oldData.Amount) - Number(newData.Amount)),
    };
    idTo = category[0].id;
  }

  if (oldData.Amount < newData.Amount) {
    updatedTo = {
      Balance:
        Number(category[0].Balance) +
        (Number(newData.Amount) - Number(oldData.Amount)),
    };
    idTo = category[0].id;
  }

  return [updatedTo, idTo];
};

export const increaseBalance = (dataList, newData, oldOrNew, FromOrTo) => {
  const account = dataList.filter(
    (account) => account.Name === oldOrNew[FromOrTo]
  );
  const updatedAccount = {
    Balance: Number(account[0].Balance) + Number(newData.Amount),
  };
  const accountId = account[0].id;

  return [updatedAccount, accountId];
};

export const decreaseBalance = (dataList, newData, oldOrNew, FromOrTo) => {
  const category = dataList.filter(
    (category) => category.Name === oldOrNew[FromOrTo]
  );

  const updatedCategory = {
    Balance: Number(category[0].Balance) - Number(newData.Amount),
  };
  const categoryId = category[0].id;

  return [updatedCategory, categoryId];
};

export const updateTotalEdit = (
  typeOfTransaction,
  listTotal,
  totalBalance,
  oldData,
  newData
) => {
  const total = listTotal.filter((total) => {
    return total.id === typeOfTransaction;
  });

  let updatedTotals;

  if (oldData.Amount > newData.Amount) {
    updatedTotals = {
      [typeOfTransaction]:
        Number(total[0][typeOfTransaction]) -
        (Number(oldData.Amount) - Number(newData.Amount)),
      balance: totalBalance,
    };
  }

  if (oldData.Amount < newData.Amount) {
    updatedTotals = {
      [typeOfTransaction]:
        Number(total[0][typeOfTransaction]) +
        (Number(newData.Amount) - Number(oldData.Amount)),
      balance: totalBalance,
    };
  }

  return updatedTotals;
};
