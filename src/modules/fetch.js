const baseURL = "https://expense-tracker-fd99a-default-rtdb.firebaseio.com";

export const getDataFromDB = async (type) => {
  const response = await fetch(`${baseURL}/${type}.json`);
  const fetchedData = await response.json();
  return fetchedData;
};

export const postNewTransactionToDB = (form, type) => {
  fetch(`${baseURL}/${type}.json`, {
    method: "POST",
    body: JSON.stringify(form),
  });
};

export const patchUpdatedDataToDB = async (data, typeOfData, id) => {
  await fetch(`${baseURL}/${typeOfData}/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const patchUpdatedTotal = async (updatedTotals) => {
  await fetch(`${baseURL}/total.json`, {
    method: "PATCH",
    body: JSON.stringify(updatedTotals),
  });
};

export const deleteTransactionFromDB = (type, transactionId) => {
  fetch(`${baseURL}/${type}/${transactionId}.json`, {
    method: "DELETE",
  });
};

export const getDataFromDBasList = async (type, isTotal) => {
  const pushFetchedDataToList = (data) => {
    const list = [];
    if (data) {
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
    }
    return list;
  };

  const fetchedData = await getDataFromDB(type);
  const fetchedDataList = pushFetchedDataToList(fetchedData);
  return fetchedDataList;
};

export const calculateTotalBalance = async () => {
  const fetchAccounts = async () => {
    const accountList = await getDataFromDBasList("accounts");
    return accountList;
  };
  const fetchedAccounts = await fetchAccounts();

  let sum = 0;
  fetchedAccounts.forEach((account) => (sum += Number(account.Balance)));

  return sum;
};
