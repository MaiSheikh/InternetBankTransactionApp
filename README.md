# Internet Bank Transaction App

## Overview

This project is a simple Internet Bank Transaction App built with Node.js, Express, and TypeScript.

The application consists of:

- A REST API built with Express.
- A terminal application built with TypeScript and `@inquirer/prompts`.
- JSON files used to simulate transaction and classification data.

The terminal application communicates with the REST API using HTTP requests and does not access the transaction data directly.

The application supports viewing, creating, updating, deleting, and filtering transactions.

---

## Technologies

- Node.js
- Express
- TypeScript
- `@inquirer/prompts`
- JSON
- Git and GitHub

---

## Project Structure

```text
InternetBankTransactionApp/
├── data/
│   ├── transactions.json
│   └── classifications.json
├── src/
│   ├── server.ts
│   ├── data.ts
│   └── cli.ts
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

### Main files

- `src/server.ts` — Express server and REST API endpoints.
- `src/data.ts` — TypeScript types and JSON data loading.
- `src/cli.ts` — Terminal interface and API communication.
- `data/transactions.json` — Simulated transaction data.
- `data/classifications.json` — Recipient classification mappings.
- `tsconfig.json` — TypeScript configuration.
- `package.json` — Project configuration and dependencies.

---

## Data and Classification

A transaction contains:

```json
{
  "id": 1,
  "date": "2026-09-20",
  "recipient": "ICA",
  "amount": -450
}
```

- `id` identifies the transaction.
- `date` contains the transaction date.
- `recipient` contains the recipient or source.
- `amount` represents the transaction amount.

Negative amounts represent outgoing transactions, while positive amounts represent incoming transactions.

Outgoing transactions are automatically classified based on their recipient.

For example:

```text
ICA → Groceries
Netflix → Entertainment
```

If no matching recipient is found, the classification is:

```text
Unknown
```

Incoming transactions do not receive a classification.

---

## REST API

The API runs on:

```text
http://localhost:3000
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get one transaction |
| POST | `/transactions` | Create a transaction |
| PUT | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |
| GET | `/classifications` | Get classification mappings |

### Create and update transactions

The required transaction fields are:

- `date`
- `recipient`
- `amount`

Example:

```json
{
  "date": "2026-09-26",
  "recipient": "Coop",
  "amount": -300
}
```

The API automatically generates a new ID when creating a transaction.

---

## Date Filtering

Transactions can be filtered using `startDate` and `endDate`.

Example:

```text
GET /transactions?startDate=2026-09-20&endDate=2026-09-22
```

The start and end dates are both included.

The API also handles invalid date ranges:

- Invalid dates → `400 Bad Request`
- Start date after end date → `400 Bad Request`
- No matching transactions → `200 OK` with an empty array

Example:

```json
[]
```

---

## Terminal Application

The terminal application uses `@inquirer/prompts` and provides the following menu:

```text
View all transactions
View one transaction
Add transaction
Update transaction
Delete transaction
Filter transactions by date
Exit
```

All transaction operations are performed through the REST API.

The CLI does not access the JSON files directly.

---

## Error Handling

The API handles invalid input and missing transactions.

Examples:

### Invalid transaction data

```text
400 Bad Request
```

```json
{
  "error": "Invalid transaction data"
}
```

### Transaction not found

```text
404 Not Found
```

```json
{
  "error": "Transaction not found"
}
```

### Invalid date

```text
400 Bad Request
```

```json
{
  "error": "Invalid date format"
}
```

---

## Running the Project

Install the dependencies:

```bash
npm install
```

### Start the API

```bash
npx tsx watch src/server.ts
```

The API will run at:

```text
http://localhost:3000
```

### Start the CLI

Open a second terminal and run:

```bash
npx tsx src/cli.ts
```

The API should be running before starting the CLI.

---

## Data Storage

The application uses JSON files instead of a database:

```text
data/transactions.json
data/classifications.json
```

Changes made through `POST`, `PUT`, and `DELETE` are stored in memory while the server is running.

They are not written back to the JSON files. Restarting the server reloads the original JSON data.

---

## GitHub Workflow

The project uses Git and GitHub for version control.

The development process includes:

- GitHub Issues for tasks.
- GitHub Project for tracking progress.
- Separate branches for development work.
- Pull Requests for merging changes into `main`.
- Clear commit messages.