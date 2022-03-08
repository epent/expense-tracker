export const checkFormValidity = (transactionForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = transactionForm.From.trim() !== "" && formIsValid;
    formIsValid = transactionForm.To.trim() !== "" && formIsValid;
    formIsValid = transactionForm.Amount !== "" && formIsValid;
  }

  if (rules.numeric) {
    formIsValid = !isNaN(Number(transactionForm.Amount)) && formIsValid;
  }

  if (rules.greaterThanZero) {
    formIsValid = transactionForm.Amount > 0 && formIsValid;
  }

  return formIsValid;
};

export const checkAccountFormValidity = (accountForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = accountForm.Name.trim() !== "" && formIsValid;
    formIsValid = accountForm.Category.trim() !== "" && formIsValid;
    formIsValid = accountForm.Balance !== "" && formIsValid;
  }

  if (rules.numeric) {
    formIsValid = !isNaN(Number(accountForm.Balance)) && formIsValid;
  }

  if (rules.greaterOrEqualToZero) {
    formIsValid = accountForm.Balance >= 0 && formIsValid;
  }

  return formIsValid;
};

export const checkCategoryFormValidity = (categoryForm, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = categoryForm.Name.trim() !== "" && formIsValid;
    formIsValid = categoryForm.Balance !== "" && formIsValid;
  }

  if (rules.numeric) {
    formIsValid = !isNaN(Number(categoryForm.Balance)) && formIsValid;
  }

  if (rules.greaterOrEqualToZero) {
    formIsValid = categoryForm.Balance >= 0 && formIsValid;
  }

  return formIsValid;
};
