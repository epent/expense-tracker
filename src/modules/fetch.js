const baseURL = "http://localhost:8080/";

export const getData = async (type, token) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }

    const response = await fetch(`${baseURL}${type}`, {
      method: "GET",
      headers: headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (type, form, token) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }

    const response = await fetch(`${baseURL}${type}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(form),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTransaction = async (type, transaction, token) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }

    const response = await fetch(`${baseURL}${type}`, {
      method: "DELETE",
      headers: headers,
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
  newTransaction,
  token
) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };
    }

    const response = await fetch(`${baseURL}${type}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ old: oldTransaction, new: newTransaction }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
