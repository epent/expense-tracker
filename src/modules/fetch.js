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

export const postEditedTransactionToDB = (form, type, id) => {
  fetch(`${baseURL}/${type}/${id}.json`, {
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
  fetch(
    `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${type}/${transactionId}.json`,
    {
      method: "DELETE",
    }
  );
};
