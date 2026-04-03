Personal Finance Dashboard:

This is a React-based dashboard built with Vite for tracking expenses and income. I built this to practice handling complex state and data visualization using Recharts.

What it does:
Overview: Charts showing monthly spending, category breakdowns, and total balance.

Transactions: A sortable and filterable table of all your data.

Admin/Viewer Toggle: A switch that lets you toggle between "Read-only" (Viewer) and "Edit mode" (Admin) to see how the UI handles permissions.

Calculated Metrics: Automatically shows things like your savings rate and month-over-month changes.

Tech Used:
React 19 + Vite
State: React Context API 
Charts: Recharts
Styling: Pure CSS

Setup:
Clone the repo and cd into the folder.
Run npm install.
Start the app with npm run dev.


File Structure:
src/context/: Holds the global state logic.
src/components/: Split into Dashboard, Insights, Topbar, and Transactions.
data.js: Contains the mock JSON data.