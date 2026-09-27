// This file creates the Express server and defines the API endpoints for the bank transactions.

import express from "express";
import { transactions, classifications } from "./data.js";;

const app = express();
const PORT = 3000;

// This middleware allows the server to read JSON data from request bodies.
app.use(express.json());

// This endpoint returns transactions and can optionally filter them by date.
app.get("/transactions", (req, res) => {
  // Get the optional start and end dates from the query string.
  const { startDate, endDate } = req.query;
    // Check that the date values are strings when they are provided.
  if (
    (startDate !== undefined && typeof startDate !== "string") ||
    (endDate !== undefined && typeof endDate !== "string")
  ) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }

  // Check that the provided dates are valid calendar dates.
  if (
    (startDate && Number.isNaN(Date.parse(startDate))) ||
    (endDate && Number.isNaN(Date.parse(endDate)))
  ) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }

  // Check that the start date is not after the end date.
  if (startDate && endDate && startDate > endDate) {
    return res.status(400).json({
      error: "Start date cannot be after end date",
    });
  }

  // Start with all transactions.
  let filteredTransactions = transactions;

  // Filter transactions from the start date if it was provided.
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.date >= startDate
    );
  }

  // Filter transactions up to the end date if it was provided.
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.date <= endDate
    );
  }


  // Add classifications to outgoing transactions.
  const transactionsWithClassification = filteredTransactions.map(
    (transaction) => {
      // Incoming transactions do not need a classification.
      if (transaction.amount >= 0) {
        return transaction;
      }

      // Find a classification that matches the transaction recipient.
      const classification = classifications.find(
        (item) => item.recipient === transaction.recipient
      );

      // Return the transaction with its classification.
      // If no classification is found, use "Unknown".
      return {
        ...transaction,
        classification: classification?.classification ?? "Unknown",
      };
    }
  );
  // Return an empty array when no transactions match the date range.
  if (transactionsWithClassification.length === 0) {
    return res.status(200).json([]);
  }
  // Send the filtered transactions back to the client as JSON.
  res.status(200).json(transactionsWithClassification);
});

// This endpoint returns one transaction by its ID.
app.get("/transactions/:id", (req, res) => {
  // Convert the ID from the URL from a string to a number.
  const id = Number(req.params.id);

  // Find the transaction with the requested ID.
  const transaction = transactions.find(
    (transaction) => transaction.id === id
  );

  // Return an error if the transaction does not exist.
  if (!transaction) {
    return res.status(404).json({
      error: "Transaction not found",
    });
  }

  // Return the requested transaction as JSON.
  res.status(200).json(transaction);
});

// This endpoint creates a new transaction.
app.post("/transactions", (req, res) => {
  // Get the transaction data sent in the request body.
  const { date, recipient, amount } = req.body;

  // Check that all required fields are provided.
  if (!date || !recipient || typeof amount !== "number") {
    return res.status(400).json({
      error: "Invalid transaction data",
    });
  }

  // Create a new ID based on the highest existing ID.
  const newId =
    transactions.length > 0
      ? Math.max(...transactions.map((transaction) => transaction.id)) + 1
      : 1;

  // Create the new transaction object.
  const newTransaction = {
    id: newId,
    date,
    recipient,
    amount,
  };

  // Add the new transaction to the transactions array.
  transactions.push(newTransaction);

  // Return the newly created transaction.
  res.status(201).json(newTransaction);
});

// This endpoint updates an existing transaction by its ID.
app.put("/transactions/:id", (req, res) => {
  // Convert the ID from the URL from a string to a number.
  const id = Number(req.params.id);

  // Find the transaction with the requested ID.
  const transaction = transactions.find(
    (transaction) => transaction.id === id
  );

  // Return an error if the transaction does not exist.
  if (!transaction) {
    return res.status(404).json({
      error: "Transaction not found",
    });
  }

  // Get the updated transaction data from the request body.
  const { date, recipient, amount } = req.body;

  // Check that all required fields are provided.
  if (!date || !recipient || typeof amount !== "number") {
    return res.status(400).json({
      error: "Invalid transaction data",
    });
  }

  // Update the transaction with the new values.
  transaction.date = date;
  transaction.recipient = recipient;
  transaction.amount = amount;

  // Return the updated transaction as JSON.
  res.status(200).json(transaction);
});

// This endpoint deletes an existing transaction by its ID.
app.delete("/transactions/:id", (req, res) => {
  // Convert the ID from the URL from a string to a number.
  const id = Number(req.params.id);

  // Find the index of the transaction with the requested ID.
  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === id
  );

  // Return an error if the transaction does not exist.
  if (transactionIndex === -1) {
    return res.status(404).json({
      error: "Transaction not found",
    });
  }

  // Remove the transaction from the transactions array.
  const deletedTransaction = transactions.splice(transactionIndex, 1);

  // Return the deleted transaction as JSON.
  res.status(200).json(deletedTransaction[0]);
});

// This endpoint returns all available transaction classifications.
app.get("/classifications", (req, res) => {
  // Send the classifications back to the client as JSON.
  res.status(200).json(classifications);
});

// Start the Express server and listen for incoming requests.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});