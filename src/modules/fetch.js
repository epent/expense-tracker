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

export const postEditedTransactionToDB = async (form, type, id) => {
  await fetch(`${baseURL}/${type}/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(form),
  });
};

export const postUpdatedBalance = async (type, id, updatedBalance) => {
  await fetch(`${baseURL}/${type}/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(updatedBalance),
  });
};

export const postUpdatedTotal = async (updatedTotals) => {
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

export const fetchAccountsFromDB = async () => {
  const pushFetchedDataToList = (data) => {
    const list = [];
    Object.keys(data).map((key) => {
      list.push({
        ...data[key],
        id: key,
      });
    });
    return list;
  };

  const fetchedData = await getDataFromDB("accounts");
  const fetchedDataList = pushFetchedDataToList(fetchedData);

  return fetchedDataList;
};

export const fetchCategoriesFromDB = async () => {
  const pushFetchedDataToList = (data) => {
    const list = [];
    Object.keys(data).map((key) => {
      list.push({
        ...data[key],
        id: key,
      });
    });
    return list;
  };

  const fetchedData = await getDataFromDB("categories");
  const fetchedDataList = pushFetchedDataToList(fetchedData);

  return fetchedDataList;
};
