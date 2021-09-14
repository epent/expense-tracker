const baseURL = "https://expense-tracker-fd99a-default-rtdb.firebaseio.com";

export const postNewTransactionToDB = (form, urlName) => {
  fetch(`${baseURL}/${urlName}.json`, {
    method: "POST",
    body: JSON.stringify(form),
  });
};

export const postEditedTransactionToDB = (form, urlName, id) => {
  fetch(`${baseURL}/${urlName}/${id}.json`, {
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

export const getDataFromDB = async (urlName) => {
  const response = await fetch(`${baseURL}/${urlName}.json`);
  const fetchedData = await response.json();
  return fetchedData;
};
