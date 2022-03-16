# Expense Tracker

An app to track your personal finance. Create categories of expenses, create multiple bank accounts/credit cards, add transactions and compare your budget on a monthly basis.

<img src="./public/Home1.png">
<img src="./public/Home2.png">

## Stack

Front-End:

- React (CRA) 17
- Material-UI 5.4
- ApexCharts 3.28

Back-End:

- Express 4.17
- sequelize 6.16
- sequelize-cli 6.4

Testing:

- Jest 27.5
- Supertest 6.2

## Description

Listed below you can find all the actions you are able to perform in this app:

### Accounts page

- Create new account (you can choose from the following categories: Bank account/Credit Card/Cash)
- Edit details of the existing account (change name/category/balance)
- Delete the account

### Categories page

- Create new expense category (on what you spend money: food, home, transport, etc...)
- Edit details of the category (change name/balance)
- Delete the category

### Expenses page

- Create new expense transaction (you can choose from multiple bank accounts/categories, choose the date, amount)
- Edit details of the existing transaction
- Delete the transaction

### Income page

- Create new income transaction (From: simply write down where this money comes from, e.g. Salary)
- Edit details of the existing transaction
- Delete the transaction

### Transfers page

Transfer transaction is when you "transfer" money between your bank accounts, credit cards or cash it out

- Create new transfer transaction
- Edit details of the existing transaction
- Delete the transaction

### History page

Lists all the transactions of all three types (expense/income/transfer)

### Home page

Summarizes all the previous information

- Total Balance: total amount on your Accounts
- Total Expenses: total of how much you spent
- Total Income: total of how much you earned

On home page you can:

- add new transaction
