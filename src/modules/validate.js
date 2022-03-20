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

  return formIsValid;
};

export const checkSignFormValidity = (form, rules) => {
  let formIsValid = true;

  if (rules.required) {
    formIsValid = form.FirstName.trim() !== "" && formIsValid;
    formIsValid = form.LastName.trim() !== "" && formIsValid;
    formIsValid = form.Email.trim() !== "" && formIsValid;
    formIsValid = form.Password.trim() !== "" && formIsValid;
  }

  if (rules.email) {
    formIsValid =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        form.Email
      ) && formIsValid;
  }

  if (rules.minLength) {
    formIsValid = form.Password.trim().length >= 7 && formIsValid;
  }

  return formIsValid;
};
