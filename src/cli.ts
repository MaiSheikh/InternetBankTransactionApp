// This file provides the terminal interface that allows the user to interact with the bank API.

import { select, input } from "@inquirer/prompts";

const API_URL = "http://localhost:3000";
// This function gets all transactions from the bank API.
async function getAllTransactions() {
  // Send a GET request to the transactions endpoint.
  const response = await fetch(`${API_URL}/transactions`);

  // Convert the response from JSON into a JavaScript value.
  const transactions = await response.json();

  // Display the transactions in the terminal.
  console.log(transactions);
}

// This function gets one transaction from the bank API by its ID.
async function getTransactionById(id: number) {
  // Send a GET request to the transaction endpoint.
  const response = await fetch(`${API_URL}/transactions/${id}`);

  // Convert the response from JSON into a JavaScript value.
  const transaction = await response.json();

  // Display the transaction in the terminal.
  console.log(transaction);
}

// This function sends a new transaction to the bank API.
async function addTransaction() {
  // Ask the user for the transaction details.
  const date = await input({
    message: "Enter date (YYYY-MM-DD):",
  });

  const recipient = await input({
    message: "Enter recipient:",
  });

  const amount = await input({
    message: "Enter amount:",
  });

  // Send the new transaction to the API.
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      recipient,
      amount: Number(amount),
    }),
  });

  // Convert the API response from JSON.
  const transaction = await response.json();

  // Display the created transaction.
  console.log(transaction);
}
// This function updates an existing transaction through the bank API.
async function updateTransaction() {
  // Ask the user which transaction should be updated.
  const id = await input({
    message: "Enter transaction ID:",
  });

  // Ask the user for the new transaction details.
  const date = await input({
    message: "Enter new date (YYYY-MM-DD):",
  });

  const recipient = await input({
    message: "Enter new recipient:",
  });

  const amount = await input({
    message: "Enter new amount:",
  });

  // Send the updated transaction to the API.
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      recipient,
      amount: Number(amount),
    }),
  });

  // Convert the API response from JSON.
  const transaction = await response.json();

  // Display the updated transaction.
  console.log(transaction);
}

// This function deletes an existing transaction through the bank API.
async function deleteTransaction() {
  // Ask the user which transaction should be deleted.
  const id = await input({
    message: "Enter transaction ID:",
  });

  // Send a DELETE request to the API.
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
  });

  // Convert the API response from JSON.
  const transaction = await response.json();

  // Display the deleted transaction.
  console.log(transaction);
}

// This function gets transactions from the bank API within a date range.
async function filterTransactionsByDate() {
  // Ask the user for the start date.
  const startDate = await input({
    message: "Enter start date (YYYY-MM-DD):",
  });

  // Ask the user for the end date.
  const endDate = await input({
    message: "Enter end date (YYYY-MM-DD):",
  });

  // Send a GET request to the API with the selected date range.
  const response = await fetch(
    `${API_URL}/transactions?startDate=${startDate}&endDate=${endDate}`
  );

  // Convert the API response from JSON.
  const transactions = await response.json();

  // Display the transactions returned by the API.
  console.log(transactions);
}
async function main() {
  // Display the main menu and wait for the user to choose an action.
  const action = await select({
    message: "What would you like to do?",
    choices: [
      {
        name: "View all transactions",
        value: "view-all",
      },
      {
        name: "View one transaction",
        value: "view-one",
      },
      {
        name: "Add transaction",
        value: "add",
      },
      {
        name: "Update transaction",
        value: "update",
      },
      {
        name: "Delete transaction",
        value: "delete",
      },
      {
        name: "Filter transactions by date",
        value: "filter-date",
      },
      {
        name: "Exit",
        value: "exit",
      },
    ],
  });

// Handle the selected menu action.
if (action === "view-all") {
  await getAllTransactions();
}

if (action === "view-one") {
  const id = await input({
    message: "Enter transaction ID:",
  });

  await getTransactionById(Number(id));
}

if (action === "add") {
  await addTransaction();
}
if (action === "update") {
  await updateTransaction();
}
if (action === "delete") {
  await deleteTransaction();
}
if (action === "filter-date") {
  await filterTransactionsByDate();
}
// Close the application when the user chooses Exit.
if (action === "exit") {
  console.log("Goodbye!");
  return;
}


}

main();