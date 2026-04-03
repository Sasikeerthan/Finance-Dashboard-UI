# Finance Dashboard UI

This repository contains the frontend implementation for the Finance Dashboard assignment. It is a responsive, single-page React application designed to track and visualize financial activity, meeting all core requirements and several optional enhancements.

## Tech Stack

* **Framework:** React 18 (bootstrapped with Vite for faster builds)
* **Styling:** Tailwind CSS (v4)
* **State Management:** Zustand
* **Data Visualization:** Recharts
* **Icons:** Lucide-React

## Features & Implementation

### 1. Dashboard Overview
* Displays aggregate metrics (Total Balance, Income, Expenses, and Savings Rate).
* Integrates a line chart for historical balance trends and a donut chart for spending breakdown.

### 2. Transactions Section
* A data table displaying all transactions with specific category formatting.
* **Performance:** Search functionality is debounced (300ms) to prevent unnecessary re-renders during rapid typing.
* **Filters:** Supports filtering by text, category, transaction type, and date range.
* **Pagination:** Implemented client-side pagination (10 items per page) to handle large transaction lists gracefully.

### 3. Role-Based UI (Simulated)
* Includes a toggle in the header to switch between `Viewer` and `Admin` modes.
* `Admin` mode unlocks the ability to delete transactions and access the "Quick Entry" form to add new records. 
* `Viewer` mode is strictly read-only.

### 4. Insights Section
* Dynamically calculates and displays the highest spending category, the most profitable savings month, and average monthly spend metrics.
* Uses grouped bar charts (Income vs. Expenses) and horizontal bar charts (Top Categories) for deeper data analysis. Includes fallback UI for empty data states.

### 5. Optional Enhancements Completed
* **Theme Toggle:** Fully supported Light and Dark modes using Tailwind's dark variant class.
* **Data Persistence:** Integrated `zustand/middleware` (persist) to save transactions, theme preference, and user role in Local Storage.
* **Export Functionality:** Users can export the currently filtered transaction view as either a `.csv` or `.json` file.

## Architectural Decisions

* **Zustand over Context/Redux:** Chose Zustand for global state management to avoid the boilerplate of Redux and the unnecessary component tree re-renders associated with React Context.
* **Component Modularity:** UI logic is strictly separated into independent components (`DashboardOverview.jsx`, `TransactionsList.jsx`, `Insights.jsx`) keeping the main `App.jsx` clean and focused on layout and tab routing.
* **Utility Abstraction:** Shared logic, such as currency/date formatting and category color configurations, are extracted into a `utils.js` file to maintain DRY principles.

## Local Setup Instructions

1. Extract the submitted project ZIP file.
2. Open the extracted folder in your terminal/command prompt.
3. Install the required dependencies:
   ```bash
   npm install
