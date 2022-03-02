const baseURL = "https://expense-tracker-fd99a-default-rtdb.firebaseio.com";

export const getDataFromDB = async (type) => {
  const response = await fetch(`${baseURL}/${type}.json`);
  const fetchedData = await response.json();
  return fetchedData;
};

export const getDataFromDBasList = async (type, isTotal) => {
  const pushFetchedDataToList = (data) => {
    const list = [];
    if (data) {
      isTotal
        ? Object.keys(data).map((key) => {
            return list.push({
              [key]: data[key],
              id: key,
            });
          })
        : Object.keys(data).map((key) => {
            return list.push({
              ...data[key],
              id: key,
              type: type,
            });
          });
    }
    return list;
  };

  const fetchedData = await getDataFromDB(type);
  const fetchedDataList = pushFetchedDataToList(fetchedData);
  return fetchedDataList;
};

const URL = "http://localhost:8080/";

export const getData = async (type) => {
  try {
    const response = await fetch(`${URL}${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (type, form) => {
  try {
    const response = await fetch(`${URL}${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransaction = async (type, transaction) => {
  try {
    const response = await fetch(`${URL}${type}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTransaction = async (
  type,
  oldTransaction,
  newTransaction
) => {
  try {
    const response = await fetch(`${URL}${type}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ old: oldTransaction, new: newTransaction }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
