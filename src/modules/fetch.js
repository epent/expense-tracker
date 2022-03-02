const baseURL = "http://localhost:8080/";

export const getData = async (type) => {
  try {
    const response = await fetch(`${baseURL}${type}`, {
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
    const response = await fetch(`${baseURL}${type}`, {
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
    const response = await fetch(`${baseURL}${type}`, {
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
    const response = await fetch(`${baseURL}${type}`, {
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
