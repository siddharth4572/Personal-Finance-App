# Personal Finance Visualizer

A simple web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features

### Stage 1: Basic Transaction Tracking ✅
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with responsive design
- ✅ Monthly expenses bar chart
- ✅ Basic form validation
- ✅ Error handling and loading states

### Stage 2: Categories (Coming Soon)
- [ ] Predefined categories for transactions
- [ ] Category-wise pie chart
- [ ] Dashboard with summary cards

### Stage 3: Budgeting (Coming Soon)
- [ ] Set monthly category budgets
- [ ] Budget vs actual comparison chart
- [ ] Spending insights

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/personal-finance
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── transactions/
│   │       ├── route.ts              # GET, POST transactions
│   │       └── [id]/
│   │           └── route.ts          # PUT, DELETE individual transactions
│   ├── globals.css                   # Global styles with shadcn/ui variables
│   └── page.tsx                      # Main application page
├── components/
│   ├── ui/                          # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── TransactionForm.tsx          # Form for adding/editing transactions
│   ├── TransactionList.tsx          # List view of transactions
│   └── MonthlyExpensesChart.tsx     # Bar chart for monthly expenses
├── lib/
│   ├── db.ts                        # MongoDB connection
│   └── utils.ts                     # Utility functions
└── types/
    └── index.ts                     # TypeScript type definitions
```

## API Endpoints

### GET /api/transactions
Returns all transactions sorted by date (newest first).

### POST /api/transactions
Creates a new transaction.
```json
{
  "amount": 50.00,
  "date": "2025-01-15",
  "description": "Groceries",
  "type": "expense"
}
```

### PUT /api/transactions/[id]
Updates an existing transaction.

### DELETE /api/transactions/[id]
Deletes a transaction.

## Usage

1. **Adding Transactions**: Click the "Add Transaction" button to open the form dialog
2. **Viewing Transactions**: All transactions are displayed in a list with the most recent first
3. **Editing**: Click the edit icon on any transaction to modify it
4. **Deleting**: Click the delete icon to remove a transaction (with confirmation)
5. **Visualizing**: View monthly expense trends in the bar chart

## Features in Detail

### Transaction Management
- Full CRUD operations for financial transactions
- Form validation for required fields and positive amounts
- Real-time updates without page refresh
- Confirmation dialogs for destructive actions

### Data Visualization
- Interactive bar chart showing monthly expense trends
- Last 6 months of data displayed
- Responsive charts that work on all screen sizes
- Currency formatting for amounts

### UI/UX
- Clean, modern interface using shadcn/ui components
- Responsive design for mobile and desktop
- Loading states and error handling
- Accessible form controls and navigation

## Development

### Building for Production
```bash
npm run build
npm start
```

### Code Style
The project uses ESLint and follows Next.js conventions. Run linting with:
```bash
npm run lint
```

## Next Steps (Stage 2)

The next phase will include:
- Transaction categories (Food, Transportation, Entertainment, etc.)
- Category-based pie charts
- Dashboard summary cards showing:
  - Total expenses
  - Category breakdown
  - Most recent transactions
