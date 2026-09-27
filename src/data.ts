// This file defines the data types and loads transaction and classification data from JSON files.

import * as fs from "fs";
import * as path from "path";

export type Transaction = {
  id: number;
  date: string;
  recipient: string;
  amount: number;
};

export type Classification = {
  recipient: string;
  classification: string;
};

// Build the paths to the JSON data files.
const transactionsPath = path.join(
  process.cwd(),
  "data",
  "transactions.json"
);

const classificationsPath = path.join(
  process.cwd(),
  "data",
  "classifications.json"
);

// Read transactions from the JSON file.
export const transactions: Transaction[] = JSON.parse(
  fs.readFileSync(transactionsPath, "utf-8")
);

// Read classifications from the JSON file.
export const classifications: Classification[] = JSON.parse(
  fs.readFileSync(classificationsPath, "utf-8")
);