import {
  postUpdatedBalance,
  postUpdatedTotal,
  getDataFromDB,
  calculateTotalBalance,
} from "./fetch";

const fetchDataToList = async (urlName, isTotal) => {
  const pushFetchedDataToList = (data) => {
    const list = [];
    isTotal
      ? Object.keys(data).map((key) => {
          list.push({
            [key]: data[key],
            id: key,
          });
        })
      : Object.keys(data).map((key) => {
          list.push({
            ...data[key],
            id: key,
          });
        });
    return list;
  };

  const fetchedData = await getDataFromDB(urlName);
  const fetchedDataList = pushFetchedDataToList(fetchedData);
  return fetchedDataList;
};

export const updateAccountBalance = async (
  form,
  typeOfTransaction,
  fromOrTo
) => {
  const fetchedAccountList = await fetchDataToList("accounts");

  if (typeOfTransaction === "expense") {
    const updateBalanceInDB = () => {
      const account = fetchedAccountList.filter(
        (account) => account.Name === form.From
      );
      const updatedAccount = {
        Balance: Number(account[0].Balance) - Number(form.Amount),
      };
      const accountId = account[0].id;

      postUpdatedBalance("accounts", accountId, updatedAccount);
    };
    updateBalanceInDB();
  }

  if (typeOfTransaction === "income") {
    const updateBalanceInDB = () => {
      const account = fetchedAccountList.filter(
        (account) => account.Name === form.To
      );
      const updatedAccount = {
        Balance: Number(account[0].Balance) + Number(form.Amount),
      };
      const accountId = account[0].id;

      postUpdatedBalance("accounts", accountId, updatedAccount);
      console.log("updatedAccount posted");
    };
    updateBalanceInDB();
  }

  if (typeOfTransaction === "transfer") {
    const updateBalanceInDB = async () => {
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

      await postUpdatedBalance("accounts", accountId, updatedAccount);
    };
    await updateBalanceInDB();
  }
};

export const updateCategoryBalance = async (form) => {
  const fetchedCategoryList = await fetchDataToList("categories");

  const updateBalanceInDB = () => {
    const category = fetchedCategoryList.filter(
      (category) => category.Name === form.To
    );
    const updatedCategory = {
      Balance: Number(category[0].Balance) + Number(form.Amount),
    };
    const categoryId = category[0].id;

    postUpdatedBalance("categories", categoryId, updatedCategory);
  };
  updateBalanceInDB();
};

export const updateTotalBalance = async (form, typeOfTransaction) => {
  const fetchedTotalList = await fetchDataToList("total", true);

  if (typeOfTransaction === "expenses") {
    const updateBalanceInDB = async () => {
      const totalExpenses = fetchedTotalList.filter((total) => {
        return total.id === "expenses";
      });

      const totalBalance = await calculateTotalBalance();

      const updatedTotals = {
        expenses: Number(totalExpenses[0].expenses) - Number(form.Amount),
        balance: totalBalance,
      };

      await postUpdatedTotal(updatedTotals);
    };
    await updateBalanceInDB();
  }

  if (typeOfTransaction === "income") {
    const updateBalanceInDB = async () => {
      const totalIncome = fetchedTotalList.filter((total) => {
        return total.id === "income";
      });

      const totalBalance = await calculateTotalBalance();

      const updatedTotals = {
        income: Number(totalIncome[0].income) + Number(form.Amount),
        balance: totalBalance,
      };

      await postUpdatedTotal(updatedTotals);
    };
    await updateBalanceInDB();
  }
};
