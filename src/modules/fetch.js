export const postNewTransactionToDB = (form, urlName) => {
  fetch(
    `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${urlName}.json`,
    {
      method: "POST",
      body: JSON.stringify(form),
    }
  );
};

export const postEditedTransactionToDB = (form, urlName, id) => {
  fetch(
    `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${urlName}/${id}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(form),
    }
  );
};

export const postUpdatedBalance = async (type, id, updatedBalance) => {
  await fetch(
    `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${type}/${id}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(updatedBalance),
    }
  );
};

export const postUpdatedTotal = async (updatedTotals) => {
  await fetch(
    "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
    {
      method: "PATCH",
      body: JSON.stringify(updatedTotals),
    }
  );
};

export const getDataFromDB = async (urlName, isTotal) => {
  const response = await fetch(
    `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${urlName}.json`
  );
  const fetchedData = await response.json();
  return fetchedData;
};
