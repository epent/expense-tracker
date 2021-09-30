import {
  postNewTransactionToDB,
  postEditedTransactionToDB,
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

export const updateAccountBalance = async (form) => {
  const fetchedAccountList = await fetchDataToList("accounts");

  const updateBalanceInDB = () => {
    const account = fetchedAccountList.filter(
      (account) => account.Name === form.From
    );
    const updatedAccount = {
      Balance: Number(account[0].Balance) - Number(form.Amount),
    };
    const accountId = account[0].id;

    postUpdatedBalance("accounts", accountId, updatedAccount);
    console.log("updateAccountBalance triggered");
  };
  updateBalanceInDB();
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
    console.log("updateCategoryBalance triggered");
  };
  updateBalanceInDB();
};

export const updateTotalBalance = async (form) => {
  const fetchedTotalList = await fetchDataToList("total", true);

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
    console.log("updateTotalBalance triggered");
  };
  await updateBalanceInDB();
};

export const triggerPageUpdates = async (setExpenseForm, updateHomeHandler) => {
  setExpenseForm({
    From: "",
    To: "",
    Amount: "",
    Date: new Date().toDateString(),
    Comment: "",
  });

  // trigger the page to rerender with updated expenseLog
  // await props.updateExpenseLog();
  // trigger Home to rerender with updated accountLog/categoryLog
  if (updateHomeHandler) await updateHomeHandler();
};
