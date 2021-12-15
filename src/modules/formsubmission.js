import {
  patchUpdatedTotal,
  patchUpdatedDataToDB as patchUpdatedBalance,
  calculateTotalBalance,
  getDataFromDBasList,
} from "./fetch";

export const updateAccountBalance = async (
  form,
  typeOfTransaction,
  fromOrTo
) => {
  const fetchedAccountList = await getDataFromDBasList("accounts");

  if (typeOfTransaction === "expense") {
    const updateBalanceInDB = () => {
      const account = fetchedAccountList.filter(
        (account) => account.Name === form.From
      );
      const updatedAccount = {
        Balance: Number(account[0].Balance) - Number(form.Amount),
      };
      const accountId = account[0].id;

      patchUpdatedBalance(updatedAccount, "accounts", accountId);
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

      patchUpdatedBalance(updatedAccount, "accounts", accountId);
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

      await patchUpdatedBalance(updatedAccount, "accounts", accountId);
    };
    await updateBalanceInDB();
  }
};

export const updateCategoryBalance = async (form) => {
  const fetchedCategoryList = await getDataFromDBasList("categories");

  const updateBalanceInDB = () => {
    const category = fetchedCategoryList.filter(
      (category) => category.Name === form.To
    );
    const updatedCategory = {
      Balance: Number(category[0].Balance) + Number(form.Amount),
    };
    const categoryId = category[0].id;

    patchUpdatedBalance(updatedCategory, "categories", categoryId);
  };
  updateBalanceInDB();
};

export const updateTotalBalance = async (form, typeOfTransaction) => {
  const fetchedTotalList = await getDataFromDBasList("total", true);

  if (typeOfTransaction === "expense") {
    const updateBalanceInDB = async () => {
      const totalExpenses = fetchedTotalList.filter((total) => {
        return total.id === "expenses";
      });

      const totalBalance = await calculateTotalBalance();

      const updatedTotals = {
        expenses: Number(totalExpenses[0].expenses) + Number(form.Amount),
        balance: totalBalance,
      };

      await patchUpdatedTotal(updatedTotals);
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

      await patchUpdatedTotal(updatedTotals);
    };
    await updateBalanceInDB();
  }
};
