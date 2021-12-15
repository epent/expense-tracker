export const checkFormValidity = (transactionForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = transactionForm.From.trim() !== "" && formIsValid;
    formIsValid = transactionForm.To.trim() !== "" && formIsValid;
    formIsValid =
      transactionForm.Amount !== "" &&
      transactionForm.Amount !== 0 &&
      formIsValid;
  }

  if (rules.greaterThanZero) {
    formIsValid = transactionForm.Amount > 0 && formIsValid;
  }

  return formIsValid;
};

export const checkAccountFormValidity = (transactionForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = transactionForm.Name.trim() !== "" && formIsValid;
    formIsValid = transactionForm.Category.trim() !== "" && formIsValid;
    formIsValid =
      transactionForm.Balance !== "" &&
      transactionForm.Balance !== 0 &&
      formIsValid;
  }

  if (rules.greaterThanZero) {
    formIsValid = transactionForm.Balance > 0 && formIsValid;
  }

  return formIsValid;
};

export const checkCategoryFormValidity = (transactionForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = transactionForm.Name.trim() !== "" && formIsValid;
    formIsValid =
      transactionForm.Balance !== "" &&
      transactionForm.Balance !== 0 &&
      formIsValid;
  }

  if (rules.greaterThanZero) {
    formIsValid = transactionForm.Balance > 0 && formIsValid;
  }

  return formIsValid;
};
