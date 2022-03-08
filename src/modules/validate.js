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

export const checkAccounCategorytFormValidity = (form, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = form.Name.trim() !== "" && formIsValid;
    formIsValid = form.Balance !== "" && formIsValid;
    if (form.Category) {
      formIsValid = form.Category.trim() !== "" && formIsValid;
    }
  }

  if (rules.numeric) {
    formIsValid = !isNaN(Number(form.Balance)) && formIsValid;
  }

  if (rules.greaterOrEqualToZero) {
    formIsValid = form.Balance >= 0 && formIsValid;
  }

  return formIsValid;
};
